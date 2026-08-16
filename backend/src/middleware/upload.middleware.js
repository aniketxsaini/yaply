import multer, { memoryStorage } from "multer";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const upload = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter:(req,file,cb)=>{
        const isImage = file.mimetype.startsWith("image/");
        const isvideo = file.mimetype.startsWith("video/");

        if(!isImage && !isvideo){
            cb(new Error("only images and video can be uploaded"));
            return;
        }
        cb(null,true);

    },

    
})
