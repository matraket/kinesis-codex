import { FastifyReply, FastifyRequest } from 'fastify';
import { getDbPool } from '../../../../infrastructure/db/client.js';

export class DashboardController {
  async summary(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const pool = getDbPool();

      const openStatuses = ['new', 'contacted', 'qualified'];
      const closedStatuses = ['converted', 'lost'];

      const [totalLeads, openLeads, closedLeads, publishedPages, legalPages, settingsCount] = await Promise.all([
        pool.query('SELECT COUNT(*)::int as count FROM leads'),
        pool.query('SELECT COUNT(*)::int as count FROM leads WHERE lead_status = ANY($1)', [openStatuses]),
        pool.query('SELECT COUNT(*)::int as count FROM leads WHERE lead_status = ANY($1)', [closedStatuses]),
        pool.query("SELECT COUNT(*)::int as count FROM page_content WHERE status = 'published'"),
        pool.query('SELECT COUNT(*)::int as count FROM legal_pages WHERE is_current = true'),
        pool.query('SELECT COUNT(*)::int as count FROM settings'),
      ]);

      return reply.status(200).send({
        leads: {
          total: totalLeads.rows[0]?.count ?? 0,
          open: openLeads.rows[0]?.count ?? 0,
          closed: closedLeads.rows[0]?.count ?? 0,
          trend: '0%',
        },
        pages: {
          published: publishedPages.rows[0]?.count ?? 0,
          legal: legalPages.rows[0]?.count ?? 0,
        },
        settings: {
          active: settingsCount.rows[0]?.count ?? 0,
          outdated: false,
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
