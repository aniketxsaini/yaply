import imagekit,{toFile} from "@imagekit/nodejs";

const image_kit = new imagekit({privateKey:process.env.IMAGEKIT_PRIVATE_KEY});

function hasImagekitConfig(){
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);   
}

//helper function to generate safe uniqiue name for file uploads

function createFileName(originalName="upload"){
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g,"_");
    return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file){
    const fileName=createFileName(file.originalName);

    const result= await image_kit.files.upload({
        file:await toFile(file.buffer,fileName,{type:file.mimetype}),
        fileName,
        folder:"/chat",
    });

    return result.url;

};

export {hasImagekitConfig,uploadChatMedia}; 