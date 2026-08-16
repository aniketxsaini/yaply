import express from "express";
const router = express.Router();
import { 
    getUsersForSidebar,
    getConversationsforSidebar,
    getMessages,
    sendMessage,

 } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

//->>>middleware (will be called for all these routes 

router.use(protectRoute);

//it is same as writing router.get('/users',protectRoute,getUsersForSidebar);

router.get('/users',getUsersForSidebar);
router.get('/conversations',getConversationsforSidebar);
router.get('/:id',getMessages);
router.post('/chat/:id',upload.single("media"),sendMessage);

//upload.single("media") same key--> "media" will be used in frontend 


export default router;