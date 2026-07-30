import { Router } from 'express';
import { smartCreateComplaint, resolveComplaint, confirmResolution } from '../controllers/complaintController';

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

export default router;
