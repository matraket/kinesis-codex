import { FastifyInstance } from 'fastify';
import { PostgresSpecialtyRepository } from '../../../../infrastructure/db/PostgresSpecialtyRepository.js';
import { PostgresInstructorRepository } from '../../../../infrastructure/db/PostgresInstructorRepository.js';
import { PostgresProgramsRepository } from '../../../../infrastructure/db/PostgresProgramsRepository.js';
import { PostgresPricingTierRepository } from '../../../../infrastructure/db/PostgresPricingTierRepository.js';
import { PostgresBusinessModelRepository } from '../../../../infrastructure/db/PostgresBusinessModelRepository.js';
import { PostgresContentRepository } from '../../../../infrastructure/db/PostgresContentRepository.js';
import { PostgresFAQRepository } from '../../../../infrastructure/db/PostgresFAQRepository.js';
import { PostgresLegalPageRepository } from '../../../../infrastructure/db/PostgresLegalPageRepository.js';
import { PostgresSettingsRepository } from '../../../../infrastructure/db/PostgresSettingsRepository.js';
import { PostgresLeadsRepository } from '../../../../infrastructure/db/PostgresLeadsRepository.js';
import {
  SpecialtiesController,
  InstructorsController,
  ProgramsController,
  PricingTiersController,
  BusinessModelsController,
  PageContentController,
  FaqsController,
  DashboardController,
} from '../controllers/index.js';
import { LegalPagesController } from '../controllers/LegalPagesController.js';
import { SettingsController } from '../controllers/SettingsController.js';
import { LeadsController } from '../controllers/LeadsController.js';
import { registerSpecialtiesRoutes } from './specialtiesRoutes.js';
import { registerInstructorsRoutes } from './instructorsRoutes.js';
import { registerProgramsRoutes } from './programsRoutes.js';
import { registerPricingTiersRoutes } from './pricingTiersRoutes.js';
import { registerBusinessModelsRoutes } from './businessModelsRoutes.js';
import { registerPageContentRoutes } from './pageContentRoutes.js';
import { registerFaqsRoutes } from './faqsRoutes.js';
import { registerLegalPagesRoutes } from './legalPagesRoutes.js';
import { registerSettingsRoutes } from './settingsRoutes.js';
import { registerLeadsRoutes } from './leadsRoutes.js';
import { registerDashboardRoutes } from './dashboardRoutes.js';
import { GetDashboardSummaryUseCase } from '../../../../application/use-cases/admin/getDashboardSummary.js';

export async function registerAdminRoutes(fastify: FastifyInstance) {
  const specialtyRepository = new PostgresSpecialtyRepository();
  const instructorRepository = new PostgresInstructorRepository();
  const programsRepository = new PostgresProgramsRepository();
  const pricingTierRepository = new PostgresPricingTierRepository();
  const businessModelRepository = new PostgresBusinessModelRepository();
  const pageContentRepository = new PostgresContentRepository();
  const faqRepository = new PostgresFAQRepository();
  const legalPageRepository = new PostgresLegalPageRepository();
  const settingsRepository = new PostgresSettingsRepository();
  const leadsRepository = new PostgresLeadsRepository();

  const specialtiesController = new SpecialtiesController(specialtyRepository);
  const instructorsController = new InstructorsController(instructorRepository);
  const programsController = new ProgramsController(programsRepository);
  const pricingTiersController = new PricingTiersController(pricingTierRepository);
  const businessModelsController = new BusinessModelsController(businessModelRepository);
  const pageContentController = new PageContentController(pageContentRepository);
  const faqsController = new FaqsController(faqRepository);
  const legalPagesController = new LegalPagesController();
  const settingsController = new SettingsController();
  const leadsController = new LeadsController();
  const getDashboardSummary = new GetDashboardSummaryUseCase(
    leadsRepository,
    pageContentRepository,
    legalPageRepository,
    settingsRepository,
  );
  const dashboardController = new DashboardController(getDashboardSummary);

  await registerSpecialtiesRoutes(fastify, specialtiesController);
  await registerInstructorsRoutes(fastify, instructorsController);
  await registerProgramsRoutes(fastify, programsController);
  await registerPricingTiersRoutes(fastify, pricingTiersController);
  await registerBusinessModelsRoutes(fastify, businessModelsController);
  await registerPageContentRoutes(fastify, pageContentController);
  await registerFaqsRoutes(fastify, faqsController);
  await registerLegalPagesRoutes(fastify, legalPagesController);
  await registerSettingsRoutes(fastify, settingsController);
  await registerLeadsRoutes(fastify, leadsController);
  await registerDashboardRoutes(fastify, dashboardController);
}
