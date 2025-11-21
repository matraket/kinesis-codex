import { FastifyInstance } from 'fastify';
import { PostgresSpecialtyRepository } from '../../../../infrastructure/db/PostgresSpecialtyRepository.js';
import { PostgresInstructorRepository } from '../../../../infrastructure/db/PostgresInstructorRepository.js';
import { PostgresProgramsRepository } from '../../../../infrastructure/db/PostgresProgramsRepository.js';
import { PostgresPricingTierRepository } from '../../../../infrastructure/db/PostgresPricingTierRepository.js';
import { PostgresBusinessModelRepository } from '../../../../infrastructure/db/PostgresBusinessModelRepository.js';
import { PostgresContentRepository } from '../../../../infrastructure/db/PostgresContentRepository.js';
import { PostgresLevelRepository } from '../../../../infrastructure/db/PostgresLevelRepository.js';
import { PostgresRoomRepository } from '../../../../infrastructure/db/PostgresRoomRepository.js';
import { PostgresCourseRepository } from '../../../../infrastructure/db/PostgresCourseRepository.js';
import { PostgresBonusRepository } from '../../../../infrastructure/db/PostgresBonusRepository.js';
import { PostgresStudentRepository } from '../../../../infrastructure/db/PostgresStudentRepository.js';
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
  LevelsController,
  RoomsController,
  CoursesController,
  BonusesController,
  StudentsController,
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
import { registerLevelsRoutes } from './levelsRoutes.js';
import { registerRoomsRoutes } from './roomsRoutes.js';
import { registerCoursesRoutes } from './coursesRoutes.js';
import { registerBonusesRoutes } from './bonusesRoutes.js';
import { registerStudentsRoutes } from './studentsRoutes.js';
import { GetDashboardSummaryUseCase } from '../../../../application/use-cases/admin/getDashboardSummary.js';
import {
  CreateLevelUseCase,
  UpdateLevelUseCase,
  DeleteLevelUseCase,
  ListLevelsUseCase,
  GetLevelByIdUseCase,
} from '../../../../application/use-cases/levels/index.js';
import {
  CreateRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
  ListRoomsUseCase,
  GetRoomByIdUseCase,
} from '../../../../application/use-cases/rooms/index.js';
import {
  CreateCourseUseCase,
  UpdateCourseUseCase,
  DeleteCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase,
} from '../../../../application/use-cases/courses/index.js';
import {
  CreateBonusUseCase,
  UpdateBonusUseCase,
  DeleteBonusUseCase,
  ListBonusesUseCase,
  GetBonusByIdUseCase,
} from '../../../../application/use-cases/bonuses/index.js';
import {
  CreateStudentUseCase,
  UpdateStudentUseCase,
  DeleteStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
} from '../../../../application/use-cases/students/index.js';

export async function registerAdminRoutes(fastify: FastifyInstance) {
  const specialtyRepository = new PostgresSpecialtyRepository();
  const instructorRepository = new PostgresInstructorRepository();
  const programsRepository = new PostgresProgramsRepository();
  const pricingTierRepository = new PostgresPricingTierRepository();
  const businessModelRepository = new PostgresBusinessModelRepository();
  const pageContentRepository = new PostgresContentRepository();
  const levelRepository = new PostgresLevelRepository();
  const roomRepository = new PostgresRoomRepository();
  const courseRepository = new PostgresCourseRepository();
  const bonusRepository = new PostgresBonusRepository();
  const studentRepository = new PostgresStudentRepository();
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
  const levelsController = new LevelsController(
    new ListLevelsUseCase(levelRepository),
    new GetLevelByIdUseCase(levelRepository),
    new CreateLevelUseCase(levelRepository),
    new UpdateLevelUseCase(levelRepository),
    new DeleteLevelUseCase(levelRepository)
  );
  const roomsController = new RoomsController(
    new ListRoomsUseCase(roomRepository),
    new GetRoomByIdUseCase(roomRepository),
    new CreateRoomUseCase(roomRepository),
    new UpdateRoomUseCase(roomRepository),
    new DeleteRoomUseCase(roomRepository)
  );
  const coursesController = new CoursesController(
    new ListCoursesUseCase(courseRepository),
    new GetCourseByIdUseCase(courseRepository),
    new CreateCourseUseCase(courseRepository),
    new UpdateCourseUseCase(courseRepository),
    new DeleteCourseUseCase(courseRepository)
  );
  const bonusesController = new BonusesController(
    new ListBonusesUseCase(bonusRepository),
    new GetBonusByIdUseCase(bonusRepository),
    new CreateBonusUseCase(bonusRepository),
    new UpdateBonusUseCase(bonusRepository),
    new DeleteBonusUseCase(bonusRepository)
  );
  const studentsController = new StudentsController(
    new ListStudentsUseCase(studentRepository),
    new GetStudentByIdUseCase(studentRepository),
    new CreateStudentUseCase(studentRepository),
    new UpdateStudentUseCase(studentRepository),
    new DeleteStudentUseCase(studentRepository)
  );
  const faqsController = new FaqsController(faqRepository);
  const legalPagesController = new LegalPagesController();
  const settingsController = new SettingsController();
  const leadsController = new LeadsController();
  const getDashboardSummary = new GetDashboardSummaryUseCase(
    leadsRepository,
    pageContentRepository,
    legalPageRepository,
    settingsRepository,
    courseRepository,
    studentRepository,
    bonusRepository,
    programsRepository,
  );
  const dashboardController = new DashboardController(getDashboardSummary);

  await registerSpecialtiesRoutes(fastify, specialtiesController);
  await registerInstructorsRoutes(fastify, instructorsController);
  await registerProgramsRoutes(fastify, programsController);
  await registerPricingTiersRoutes(fastify, pricingTiersController);
  await registerBusinessModelsRoutes(fastify, businessModelsController);
  await registerPageContentRoutes(fastify, pageContentController);
  await registerLevelsRoutes(fastify, levelsController);
  await registerRoomsRoutes(fastify, roomsController);
  await registerCoursesRoutes(fastify, coursesController);
  await registerBonusesRoutes(fastify, bonusesController);
  await registerStudentsRoutes(fastify, studentsController);
  await registerFaqsRoutes(fastify, faqsController);
  await registerLegalPagesRoutes(fastify, legalPagesController);
  await registerSettingsRoutes(fastify, settingsController);
  await registerLeadsRoutes(fastify, leadsController);
  await registerDashboardRoutes(fastify, dashboardController);
}
