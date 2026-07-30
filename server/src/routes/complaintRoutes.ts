import { Router } from 'express';
import { smartCreateComplaint, resolveComplaint, confirmResolution, getComplaintLedger, getStudentComplaints, getComplaint } from '../controllers/complaintController';

const router = Router();

// Endpoint for AI Smart Triage
// POST /api/complaints/smart
router.post('/smart', smartCreateComplaint);

// Endpoint for resolving a complaint and awarding karma points
// POST /api/complaints/:id/resolve
router.post('/:id/resolve', resolveComplaint);

// Endpoint for confirming a resolution
// POST /api/complaints/:id/confirm
router.post('/:id/confirm', confirmResolution);

// Endpoint to fetch Tamper-Evident Ledger
// GET /api/complaints/:id/ledger
router.get('/:id/ledger', getComplaintLedger);

// Endpoint to fetch student's active complaints
// GET /api/complaints/student/:reporterId
router.get('/student/:reporterId', getStudentComplaints);

// Endpoint to fetch single complaint details
// GET /api/complaints/:id
router.get('/:id', getComplaint);

export default router;
