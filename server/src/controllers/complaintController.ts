import { Request, Response } from 'express';
import prisma from '../db';
import { analyzeComplaint } from './aiController';
import crypto from 'crypto';

// Helper for the Hash Chain Ledger
function createLedgerHash(complaintId: string, action: string, details: string, previousHash: string | null): string {
  const dataToHash = `${complaintId}:${action}:${details}:${previousHash || 'GENESIS'}`;
  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

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

    // 4. Save structured ticket to DB
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
        escalationLevel: 0, // Starts at Technician
      },
    });

    // 5. Blockchain-style Tamper-Evident Ledger (Genesis Block)
    const action = 'CREATED_VIA_AI';
    const details = 'Complaint was auto-categorized by AI Triage system';
    const hash = createLedgerHash(complaint.id, action, details, null);

    await prisma.auditLog.create({
      data: {
        action,
        details,
        complaintId: complaint.id,
        hash,
        previousHash: null
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

    if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' || complaint.status === 'AWAITING_VERIFICATION') {
      return res.status(400).json({ error: 'Complaint is already resolved or awaiting verification' });
    }

    // 1. Update Complaint status to AWAITING_VERIFICATION for Student Confirmation
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: 'AWAITING_VERIFICATION',
        resolvedAt: new Date(),
        rating,
      },
    });

    // 2. Fetch the previous hash for the Tamper-Evident Ledger
    const lastAudit = await prisma.auditLog.findFirst({
      where: { complaintId: id },
      orderBy: { createdAt: 'desc' }
    });

    const action = 'STATUS_CHANGED';
    const details = `Technician marked as AWAITING_VERIFICATION. Rating input: ${rating || 'N/A'}`;
    const previousHash = lastAudit?.hash || null;
    const hash = createLedgerHash(id, action, details, previousHash);

    // 3. Append to AuditLog chain
    await prisma.auditLog.create({
      data: {
        action,
        details,
        complaintId: complaint.id,
        hash,
        previousHash
      },
    });

    return res.status(200).json({ message: 'Complaint marked as awaiting student verification!', complaint: updatedComplaint });
  } catch (error: any) {
    console.error('Error resolving complaint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const confirmResolution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.status !== 'AWAITING_VERIFICATION') {
      return res.status(400).json({ error: 'Complaint must be awaiting verification' });
    }

    // 1. Update status to RESOLVED
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status: 'RESOLVED' }
    });

    // 2. Gamification: Award Karma Points
    await prisma.user.update({
      where: { id: complaint.reporterId },
      data: { karmaPoints: { increment: 10 } }, // 10 pts to reporter
    });

    if (complaint.assigneeId) {
      let pointsToAward = 20;
      if (complaint.rating === 5) pointsToAward += 10;
      await prisma.user.update({
        where: { id: complaint.assigneeId },
        data: { karmaPoints: { increment: pointsToAward } },
      });
    }

    // 3. Append to Tamper-Evident Ledger
    const lastAudit = await prisma.auditLog.findFirst({
      where: { complaintId: id },
      orderBy: { createdAt: 'desc' }
    });

    const action = 'STUDENT_CONFIRMED';
    const details = 'Student verified resolution. Gamification points awarded.';
    const previousHash = lastAudit?.hash || null;
    const hash = createLedgerHash(id, action, details, previousHash);

    await prisma.auditLog.create({
      data: { action, details, complaintId: complaint.id, hash, previousHash },
    });

    return res.status(200).json({ message: 'Resolution verified!', complaint: updatedComplaint });
  } catch (error: any) {
    console.error('Error confirming resolution:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
