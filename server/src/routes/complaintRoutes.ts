import { Router } from 'express';
import { smartCreateComplaint, resolveComplaint } from '../controllers/complaintController';

const router = Router();

// Endpoint for AI Smart Triage
// POST /api/complaints/smart
router.post('/smart', smartCreateComplaint);

// Endpoint for resolving a complaint and awarding karma points
// POST /api/complaints/:id/resolve
router.post('/:id/resolve', resolveComplaint);

export default router;
