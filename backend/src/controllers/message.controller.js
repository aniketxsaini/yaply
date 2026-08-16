import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImagekitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getRecieverSocketid } from "../lib/socket.js";
export async function getUsersForSidebar(req,res){
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await user.find({_id:{$ne:loggedInUserId}}).select("-clerkId");

        res.status(200).json(filteredUsers)


    }catch(err){
        console.log("error in get user for sidebar",err.message);
        return res.status(500).json({msg:"getUserForSidebar controller error"});
    }
};

export async function getConversationsforSidebar(req,res){
 try{
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
        {
            $match:{
                $or:[ 
                    {senderId:loggedInUserId},
                    {receiverId:loggedInUserId}
                ]
            }
        },
        
        {
            $group:{
                _id:{
                    $cond:[{$eq:["$senderId",loggedInUserId]},"$receiverId","$senderId"]
                },
                lastMessageAt:{$max:"$createdAt"},
            },
        },

        {
            $sort:{lastMessageAt:-1},
        },

        {
            $lookup:{from:"users",localField:"_id",foreignField:"_id",as:"user"},
        },

        {
            $replaceRoot:{newRoot:{$first:"$user"}},
        },
        {
            $project:{clerkid:0},

        }
    ]);

    res.status(200).json(conversations);

    

 }  catch(err){
    console.log("error from getConversationsForSidebar",err.message);
    return res.status(500).json({msg:"conversations error"});
 } 
};

export async function getMessages(req,res){
    try{
        const { id:userTochatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {$senderId:myId,receiverId:userTochatId},
                {senderId:userTochatId,receiverId:myId},
            ]
        }).sort({createdAt:1});

        res.status(200).json(messages);

    }catch(err){
        console.log("getMessages error",err.message);
        return res.status(500).json({msg:"internal server error in get messages "})
    }
};

export async function sendMessage(req,res) {
    try{
        const { text } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        let videoUrl;

        if(req.file){
            if(!hasImagekitConfig()){
                return res.status(500).json({msg:"media upload is not configured"});
            }

            const url = await uploadChatMedia(req.file);
            if(req.file.mimetype.startWith("video/")) videoUrl=url;
            else imageUrl=url;

            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                imageUrl,
                videoUrl,
            })

            await newMessage.save();

            //todo realtime with socket
            const receiverSocketId = getRecieverSocketid;
            //only send message if receiver is online
            if(receiverSocketId){
                io.to(receiverSocketId).emit('newMessage',newMessage);
            }

            res.status(201).json({newMessage});

        }

    }catch(err){
        console.log("send message error ", err.message);
        return res.status(500).json({msg:"send message internal server error"});
    }
    
}
