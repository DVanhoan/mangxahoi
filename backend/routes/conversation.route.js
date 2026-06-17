import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createConversation,
  getLastMessage,
  getConversation,
  getConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/:conversationId", protectRoute, getConversation);
router.get("/lastMessage", protectRoute, getLastMessage);
router.get("/all", protectRoute, getConversations);

export default router;
