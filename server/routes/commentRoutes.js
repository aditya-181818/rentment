import express from "express";
import { protect } from "../middleware/auth.js";
import { sendComment, getComments, replyComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/send", protect, sendComment);
router.get("/:productId", protect, getComments);
router.post("/reply", protect, replyComment);

export default router;
