import prisma from './db';
import crypto from 'crypto';

// Helper for the Hash Chain Ledger
function createLedgerHash(complaintId: string, action: string, details: string, previousHash: string | null): string {
  const dataToHash = `${complaintId}:${action}:${details}:${previousHash || 'GENESIS'}`;
  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

export const startEscalationCron = () => {
  console.log('[server]: Starting Automatic Escalation Cron Job');
  
  // Run every 10 seconds for demonstration purposes (in production this would be every minute or hour)
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Find all complaints that are past their deadline and not yet resolved/closed/awaiting verification
      const overdueComplaints = await prisma.complaint.findMany({
        where: {
          status: {
            in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED']
          },
          deadline: {
            lt: now
          },
          escalationLevel: {
            lt: 2 // Max level is 2 (Dean)
          }
        }
      });

      for (const complaint of overdueComplaints) {
        // Increment escalation level
        const newLevel = complaint.escalationLevel + 1;
        const levelName = newLevel === 1 ? 'WARDEN' : 'DEAN';

        console.log(`[server]: Escalating complaint ${complaint.id} to level ${newLevel} (${levelName})`);

        await prisma.$transaction(async (tx) => {
          // 1. Update Complaint
          await tx.complaint.update({
            where: { id: complaint.id },
            data: { 
              escalationLevel: newLevel,
              status: 'ESCALATED' 
            }
          });

          // 2. Fetch last audit log for hash chain
          const lastAudit = await tx.auditLog.findFirst({
            where: { complaintId: complaint.id },
            orderBy: { createdAt: 'desc' }
          });

          const action = 'AUTOMATIC_ESCALATION';
          const details = `Deadline expired. Ticket escalated to ${levelName}.`;
          const previousHash = lastAudit?.hash || null;
          const hash = createLedgerHash(complaint.id, action, details, previousHash);

          // 3. Append to Ledger
          await tx.auditLog.create({
            data: {
              action,
              details,
              complaintId: complaint.id,
              hash,
              previousHash
            }
          });
        });
      }

      // DEAD-MAN'S SWITCH LOGIC
      const deadManTimeLimit = new Date(now.getTime() - 45 * 1000); // 45 seconds ago
      const deadTickets = await prisma.complaint.findMany({
        where: {
          handshakeVerified: true,
          status: { in: ['ASSIGNED', 'IN_PROGRESS', 'ESCALATED'] },
          lastActivityAt: { lt: deadManTimeLimit }
        }
      });

      for (const ticket of deadTickets) {
        console.log(`[server]: Dead-Man's Switch activated for complaint ${ticket.id}. Unassigning...`);
        await prisma.$transaction(async (tx) => {
          await tx.complaint.update({
            where: { id: ticket.id },
            data: {
              status: 'PENDING',
              assigneeId: null,
              handshakeVerified: false,
              handshakePin: null, // Wipe the PIN
              lastActivityAt: null,
            }
          });

          const lastAudit = await tx.auditLog.findFirst({
            where: { complaintId: ticket.id },
            orderBy: { createdAt: 'desc' }
          });

          const action = 'DEAD_MAN_SWITCH_ACTIVATED';
          const details = 'Technician was inactive for > 45 seconds. Ticket unassigned and routed back to queue.';
          const previousHash = lastAudit?.hash || null;
          const hash = createLedgerHash(ticket.id, action, details, previousHash);

          await tx.auditLog.create({
            data: { action, details, complaintId: ticket.id, hash, previousHash }
          });
        });
      }

    } catch (error) {
      console.error('[server]: Error in Escalation Cron:', error);
    }
  }, 10000); // 10 seconds
};
