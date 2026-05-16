import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";
import transfersRouter from "./transfers";
import customersRouter from "./customers";
import bookingsRouter from "./bookings";
import galleryRouter from "./gallery";
import faqsRouter from "./faqs";
import leadsRouter from "./leads";
import conversationsRouter from "./conversations";
import knowledgeRouter from "./knowledge";
import statsRouter from "./stats";
import settingsRouter from "./settings";
import aiRouter from "./ai";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toursRouter);
router.use(transfersRouter);
router.use(customersRouter);
router.use(bookingsRouter);
router.use(galleryRouter);
router.use(faqsRouter);
router.use(leadsRouter);
router.use(conversationsRouter);
router.use(knowledgeRouter);
router.use(statsRouter);
router.use(settingsRouter);
router.use(aiRouter);
router.use(adminRouter);

export default router;
