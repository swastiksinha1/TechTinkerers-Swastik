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
    const { text, reporterId, locationId, imageBase64 } = req.body;

    if (!text || !reporterId || !locationId) {
      return res.status(400).json({ error: 'Missing required fields (text, reporterId, locationId)' });
    }

    // 1. Analyze unstructured text (and photo if present) with Gemini AI
    const aiAnalysis = await analyzeComplaint(text, imageBase64);

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

    // 3. Instant Routing (Auto-Assign to Technician based on Department)
    // In a real app, this would query active technicians in the assigned department.
    const assigneeId = `tech_${aiAnalysis.department.toLowerCase().replace(/[^a-z0-9]/g, '')}_01`;
    await prisma.user.upsert({
      where: { id: assigneeId },
      update: {},
      create: {
        id: assigneeId,
        email: `${assigneeId}@campus.edu`,
        name: `Tech ${aiAnalysis.department}`,
        role: 'TECHNICIAN'
      }
    });

    // 4. Set deadline based on priority (SLA)
    let deadline = new Date();
    switch (aiAnalysis.priority) {
      case 'CRITICAL': deadline.setMinutes(deadline.getMinutes() + 1); break; // 1 min for demo of Escalation
      case 'HIGH': deadline.setHours(deadline.getHours() + 2); break; 
      case 'MEDIUM': deadline.setHours(deadline.getHours() + 24); break; 
      case 'LOW': deadline.setDate(deadline.getDate() + 7); break;
    }

    // 5. Save structured ticket to DB
    const complaint = await prisma.complaint.create({
      data: {
        title: aiAnalysis.title,
        description: text,
        department: aiAnalysis.department,
        priority: aiAnalysis.priority,
        status: 'ASSIGNED', // Automatically moved past PENDING
        deadline,
        reporterId,
        assigneeId, // Instant Routing
        locationId,
        aiAnalysis: JSON.stringify(aiAnalysis),
        photoUrl: imageBase64 || null,
        escalationLevel: 0, // Starts at Technician
        handshakePin: Math.floor(1000 + Math.random() * 9000).toString(),
      },
    });

    // 6. Blockchain-style Tamper-Evident Ledger (Genesis Block)
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

export const manualCreateComplaint = async (req: Request, res: Response) => {
  try {
    const { title, description, department, priority, reporterId, locationId, imageBase64 } = req.body;

    if (!title || !description || !department || !priority || !reporterId || !locationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Ensure User and Location exist
    await prisma.user.upsert({
      where: { id: reporterId },
      update: {},
      create: { id: reporterId, email: `student_${reporterId}@campus.edu`, name: `Student ${reporterId}`, role: 'STUDENT' }
    });
    await prisma.location.upsert({
      where: { id: locationId },
      update: {},
      create: { id: locationId, qrCodeId: `qr_${locationId}`, name: `Room / Area ${locationId}` }
    });

    // 2. Instant Routing
    const assigneeId = `tech_${department.toLowerCase().replace(/[^a-z0-9]/g, '')}_01`;
    await prisma.user.upsert({
      where: { id: assigneeId },
      update: {},
      create: { id: assigneeId, email: `${assigneeId}@campus.edu`, name: `Tech ${department}`, role: 'TECHNICIAN' }
    });

    // 3. Set deadline based on priority (SLA)
    let deadline = new Date();
    switch (priority) {
      case 'CRITICAL': deadline.setMinutes(deadline.getMinutes() + 1); break; // 1 min for demo of Escalation
      case 'HIGH': deadline.setHours(deadline.getHours() + 2); break; 
      case 'MEDIUM': deadline.setHours(deadline.getHours() + 24); break; 
      case 'LOW': deadline.setDate(deadline.getDate() + 7); break;
    }

    // 4. Save ticket to DB
    const complaint = await prisma.complaint.create({
      data: {
        title, description, department, priority, status: 'ASSIGNED', deadline, reporterId, assigneeId, locationId, escalationLevel: 0, photoUrl: imageBase64 || null,
        handshakePin: Math.floor(1000 + Math.random() * 9000).toString(),
      },
    });

    // 5. Ledger
    const action = 'CREATED_MANUALLY';
    const details = 'Complaint was created manually by the user';
    const hash = createLedgerHash(complaint.id, action, details, null);

    await prisma.auditLog.create({
      data: { action, details, complaintId: complaint.id, hash, previousHash: null },
    });

    return res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error: any) {
    console.error('Error creating manual complaint:', error);
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

export const getComplaintLedger = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const logs = await prisma.auditLog.findMany({
      where: { complaintId: id },
      orderBy: { createdAt: 'asc' }
    });
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Error fetching ledger:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentComplaints = async (req: Request, res: Response) => {
  try {
    const { reporterId } = req.params;
    const complaints = await prisma.complaint.findMany({
      where: { reporterId },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ complaints });
  } catch (error) {
    console.error('Error fetching student complaints:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicFeed = async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: {
        status: { not: 'CLOSED' }
      },
      include: {
        userUpvotes: {
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ complaints });
  } catch (error) {
    console.error('Error fetching public feed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const upvoteComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Expect userId from frontend
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if the user already upvoted this complaint
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_complaintId: {
          userId,
          complaintId: id,
        }
      }
    });

    if (existingUpvote) {
      return res.status(400).json({ error: 'You have already upvoted this issue.' });
    }

    // Transaction to ensure atomicity
    const [upvote, updatedComplaint] = await prisma.$transaction([
      prisma.upvote.create({
        data: {
          userId,
          complaintId: id,
        }
      }),
      prisma.complaint.update({
        where: { id },
        data: { upvotes: { increment: 1 } }
      })
    ]);

    return res.status(200).json({ complaint: updatedComplaint, message: 'Upvoted successfully!' });
  } catch (error) {
    console.error('Error upvoting complaint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyPin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    if (complaint.handshakePin !== pin) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { handshakeVerified: true, lastActivityAt: new Date() }
    });
    return res.status(200).json({ message: 'Handshake successful', complaint: updated });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { lastActivityAt: new Date() }
    });
    return res.status(200).json({ message: 'Activity logged', complaint });
  } catch (error) {
    console.error('Error logging activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLiveDashboardData = async (req: Request, res: Response) => {
  try {
    // 1. Recent Activity Ticker (Latest 20 Audit Logs)
    const recentActivity = await prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        complaint: {
          select: { title: true, priority: true, department: true, location: { select: { name: true } } }
        }
      }
    });

    // 2. Stats Aggregation
    const pendingCount = await prisma.complaint.count({ where: { status: 'PENDING' } });
    const activeCount = await prisma.complaint.count({ where: { status: { in: ['ASSIGNED', 'IN_PROGRESS', 'AWAITING_VERIFICATION'] } } });
    const resolvedCount = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
    const escalatedCount = await prisma.complaint.count({ where: { status: 'ESCALATED' } });

    // 3. Urgent Issues (Unresolved CRITICAL/HIGH priority)
    const urgentIssues = await prisma.complaint.findMany({
      where: {
        status: { notIn: ['RESOLVED', 'CLOSED'] },
        priority: { in: ['CRITICAL', 'HIGH'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { location: { select: { name: true } } }
    });

    return res.status(200).json({
      recentActivity,
      stats: { pending: pendingCount, active: activeCount, resolved: resolvedCount, escalated: escalatedCount },
      urgentIssues
    });
  } catch (error) {
    console.error('Error fetching live dashboard data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
