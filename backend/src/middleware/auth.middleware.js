import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";



export async function protectRoute(req,res,next){
    try{
        const {userId} = getAuth(req);
        if(!userId){
            return res.status(401).josn({
                msg:"authentication failed",
            });
        }
        const user = await User.findOne({clerkId:userId});

        if(!user){
            return res.status(404).json({
                msg:"user not found or not in sync with database yet",
            });
        }

        req.user=user;
        next();
        
    }catch(error){
        console.log("something wrong in protectRoute middleware");
        return res.status(500).json({
            msg:"something wrong in protectRoute middleware - internal server error",
        })
    }
}