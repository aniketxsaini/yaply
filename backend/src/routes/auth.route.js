import express from "express";

const router=express.Router();
import { checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

//api/auth/check
router.get('/check',protectRoute,checkAuth);

export default router;