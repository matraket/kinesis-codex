import type { ContentRepository } from '../../ports/ContentRepository.js';
import type { ILegalPageRepository } from '../../ports/ILegalPageRepository.js';
import type { LeadsRepository } from '../../ports/LeadsRepository.js';
import type { ISettingsRepository } from '../../ports/ISettingsRepository.js';
import type { Result } from '../../../shared/types/index.js';
import { Err, Ok } from '../../../shared/types/index.js';

export interface DashboardSummary {
  leads: { total: number; open: number; closed: number; trend?: string };
  pages: { published: number; legal: number };
  settings: { active: number; outdated: boolean };
}

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly contentRepository: ContentRepository,
    private readonly legalPageRepository: ILegalPageRepository,
    private readonly settingsRepository: ISettingsRepository,
  ) {}

  async execute(): Promise<Result<DashboardSummary, Error>> {
    try {
      const [leadCountsResult, publishedPagesResult, legalPagesResult, settingsStatusResult] = await Promise.all([
        this.leadsRepository.getStatusCounts(),
        this.contentRepository.countPublishedPages(),
        this.legalPageRepository.countCurrent(),
        this.settingsRepository.getStatus(),
      ]);

      if (leadCountsResult.isErr()) return Err(leadCountsResult.error);
      if (publishedPagesResult.isErr()) return Err(publishedPagesResult.error);
      if (legalPagesResult.isErr()) return Err(legalPagesResult.error);
      if (settingsStatusResult.isErr()) return Err(settingsStatusResult.error);

      return Ok({
        leads: { ...leadCountsResult.value, trend: '0%' },
        pages: { published: publishedPagesResult.value, legal: legalPagesResult.value },
        settings: settingsStatusResult.value,
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error calculating dashboard summary'));
    }
  }
}
