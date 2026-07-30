import { Request, Response } from 'express';
import prisma from '../db';
import { analyzeComplaint } from './aiController';

export const smartCreateComplaint = async (req: Request, res: Response) => {
  try {
    const { text, reporterId, locationId } = req.body;

    if (!text || !reporterId || !locationId) {
      return res.status(400).json({ error: 'Missing required fields (text, reporterId, locationId)' });
    }

    // 1. Analyze unstructured text with Gemini AI
    const aiAnalysis = await analyzeComplaint(text);

    // 2. Ensure User and Location exist to satisfy Foreign Key constraints
    await prisma.user.upsert({
      where: { id: reporterId },
      update: {},
      create: {
        id: reporterId,
        email: `student_${reporterId}@campus.edu`,
        name: `Student ${reporterId}`,
        role: 'STUDENT'
      }
    });

    await prisma.location.upsert({
      where: { id: locationId },
      update: {},
      create: {
        id: locationId,
        qrCodeId: `qr_${locationId}`,
        name: `Room / Area ${locationId}`
      }
    });

    // 3. Set deadline based on priority (SLA)
    let deadline = new Date();
    switch (aiAnalysis.priority) {
      case 'CRITICAL': deadline.setHours(deadline.getHours() + 2); break; // 2 hours
      case 'HIGH': deadline.setHours(deadline.getHours() + 12); break; // 12 hours
      case 'MEDIUM': deadline.setDate(deadline.getDate() + 2); break; // 2 days
      case 'LOW': deadline.setDate(deadline.getDate() + 7); break; // 7 days
    }

    // 3. Save structured ticket to DB
    const complaint = await prisma.complaint.create({
      data: {
        title: aiAnalysis.title,
        description: text,
        department: aiAnalysis.department,
        priority: aiAnalysis.priority,
        status: 'PENDING',
        deadline,
        reporterId,
        locationId,
        aiAnalysis: JSON.stringify(aiAnalysis),
      },
    });

    // 4. Create an audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATED_VIA_AI',
        details: 'Complaint was auto-categorized by AI Triage system',
        complaintId: complaint.id,
      },
    });

    return res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error: any) {
    console.error('Error creating smart complaint:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const resolveComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body; // Optional rating from 1-5

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') {
      return res.status(400).json({ error: 'Complaint is already resolved or closed' });
    }

    // 1. Update Complaint status
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        rating,
      },
    });

    // 2. Gamification: Award Karma Points
    // 10 points to reporter for reporting a valid issue that got fixed
    await prisma.user.update({
      where: { id: complaint.reporterId },
      data: { karmaPoints: { increment: 10 } },
    });

    // 20 points to assignee for fixing it
    if (complaint.assigneeId) {
      let pointsToAward = 20;
      // Bonus points if rating is 5
      if (rating === 5) pointsToAward += 10;
      
      await prisma.user.update({
        where: { id: complaint.assigneeId },
        data: { karmaPoints: { increment: pointsToAward } },
      });
    }

    // 3. Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'RESOLVED_AND_GAMIFIED',
        details: `Complaint resolved. Karma points awarded to reporter and assignee. Rating: ${rating || 'N/A'}`,
        complaintId: complaint.id,
      },
    });

    return res.status(200).json({ message: 'Complaint resolved and points awarded!', complaint: updatedComplaint });
  } catch (error: any) {
    console.error('Error resolving complaint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
