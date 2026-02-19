import express from "express";
import { protect } from "../middleware/auth.js";
import { dummyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Dummy payment route
paymentRouter.post("/dummy", protect, dummyPayment);

export default paymentRouter;
