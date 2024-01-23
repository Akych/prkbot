const { vk } = require("../cfg.json")
const fs = require("fs") 

try{

    if (!fs.existsSync("./files")){
        fs.mkdirSync("./files");
        console.log("Initalize file directory...")
    }

    if (!fs.existsSync("./files/temp")){
        fs.mkdirSync("./files/temp");
        console.log("Initalize temp directory...")
    }

    if (!fs.existsSync("./files/temp/groups")){
        fs.mkdirSync("./files/temp/groups");
        console.log("Initalize groups directory...")
    }
    if (!fs.existsSync("./files/temp/people")){
        fs.mkdirSync("./files/temp/people");
        console.log("Initalize people directory...")
    }

    if (!fs.existsSync("./files/schedulehash.txt")) {
        fs.writeFileSync("./files/schedulehash.txt","") 
        console.log("Initalize schedulehash.txt file...")
    }

}catch (e){
    console.log("Cannot write file ", e);
}



module.exports.createpath = (path)=>{
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
        console.log("Initalize ",path)
    }
}