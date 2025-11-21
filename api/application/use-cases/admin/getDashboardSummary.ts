import type { ContentRepository } from '../../ports/ContentRepository.js';
import type { ILegalPageRepository } from '../../ports/ILegalPageRepository.js';
import type { LeadsRepository } from '../../ports/LeadsRepository.js';
import type { ISettingsRepository } from '../../ports/ISettingsRepository.js';
import type { Result } from '../../../shared/types/index.js';
import { Err, Ok } from '../../../shared/types/index.js';

export interface DashboardSummary {
  leads: { total: number; open: number; closed: number; trend?: string };
  pages: { published: number; legal: number };
  programs?: { total: number };
  settings: { active: number; outdated: boolean };
  courses?: { total: number };
  students?: { total: number };
  bonuses?: { total: number };
}

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly contentRepository: ContentRepository,
    private readonly legalPageRepository: ILegalPageRepository,
    private readonly settingsRepository: ISettingsRepository,
    private readonly courseRepository?: { countAll: () => Promise<Result<number, Error>> },
    private readonly studentRepository?: { countAll: () => Promise<Result<number, Error>> },
    private readonly bonusRepository?: { countAll: () => Promise<Result<number, Error>> },
    private readonly programsRepository?: { countAll: () => Promise<Result<number, Error>> },
  ) {}

  async execute(): Promise<Result<DashboardSummary, Error>> {
    try {
      const [
        leadCountsResult,
        publishedPagesResult,
        legalPagesResult,
        settingsStatusResult,
        coursesCount,
        studentsCount,
        bonusesCount,
        programsCount
      ] = await Promise.all([
        this.leadsRepository.getStatusCounts(),
        this.contentRepository.countPublishedPages(),
        this.legalPageRepository.countCurrent(),
        this.settingsRepository.getStatus(),
        this.courseRepository?.countAll?.() ?? Promise.resolve(Ok(0)),
        this.studentRepository?.countAll?.() ?? Promise.resolve(Ok(0)),
        this.bonusRepository?.countAll?.() ?? Promise.resolve(Ok(0)),
        this.programsRepository?.countAll?.() ?? Promise.resolve(Ok(0)),
      ]);

      if (leadCountsResult.isErr()) return Err(leadCountsResult.error);
      if (publishedPagesResult.isErr()) return Err(publishedPagesResult.error);
      if (legalPagesResult.isErr()) return Err(legalPagesResult.error);
      if (settingsStatusResult.isErr()) return Err(settingsStatusResult.error);
      if (coursesCount.isErr && coursesCount.isErr()) return Err((coursesCount as any).error);
      if (studentsCount.isErr && studentsCount.isErr()) return Err((studentsCount as any).error);
      if (bonusesCount.isErr && bonusesCount.isErr()) return Err((bonusesCount as any).error);
      if (programsCount.isErr && programsCount.isErr()) return Err((programsCount as any).error);

      return Ok({
        leads: { ...leadCountsResult.value, trend: '0%' },
        pages: { published: publishedPagesResult.value, legal: legalPagesResult.value },
        settings: settingsStatusResult.value,
        courses: { total: coursesCount.value ?? 0 },
        students: { total: studentsCount.value ?? 0 },
        bonuses: { total: bonusesCount.value ?? 0 },
        programs: { total: programsCount.value ?? 0 },
      });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error calculating dashboard summary'));
    }
  }
}
