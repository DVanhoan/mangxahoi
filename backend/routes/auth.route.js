import express from "express";
import {
  getMe,
  login,
  logout,
  signup,
  googleLogin
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login", googleLogin);



export default router;
