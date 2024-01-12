
// main logic

const downloader = require("./modules/downLoadschedule.js")
const xlsxhtml = require("./modules/xlsxhtml.js")
const xlsxeditor = require("./modules/xlsxeditor.js")
const htmlimage = require("./modules/htmlimage.js")
const xlsxparser = require("./modules/xlsxparser.js")
const { vk } = require("./cfg.json")

const fs = require("fs")
const Queue = require("./modules/queue.js")

if (!fs.existsSync(vk.schedule.hashfilepath)) {
    fs.writeFileSync(vk.schedule.hashfilepath,"") 
}

if (!fs.existsSync("./files")){
    fs.mkdirSync("./files");
}

var hash = fs.readFileSync(vk.schedule.hashfilepath,{ encoding: 'utf8', flag: 'r' });

const tasklist = new Queue()

const watcher = setInterval(async () => {
    let link = await downloader.getScheduleLink()
    let data = link.match(/hash=(.+)/i)

    if(data && data[1]){
        
        if(hash !== data[1]){
            hash = data[1]
            fs.writeFileSync(vk.schedule.hashfilepath,hash) // update hash
            await downloader.run()

            xlsxparser.getCoursesRange("./files/schedule.xlsx").then(async (cources)=>{
                console.log(cources)
                var workdir = `./temp/!расписание`
                if (!fs.existsSync(workdir)){
                    fs.mkdirSync(workdir);
                }
                for (let index = 0; index < cources.length; index++) {
                    const range = cources[index]
                    console.log(range)
                    try {
                        var pathfile = await xlsxeditor.cut("./files/schedule.xlsx",`${workdir}/${index+1}.xlsx`,[range.start,range.end])
                        var pathhtml = await xlsxhtml(pathfile,`${workdir}/${index+1}.html`)
                        await htmlimage(pathhtml,`${workdir}/${index+1}.png`)

                        fs.unlink(pathfile,()=>{}); 
                        fs.unlink(pathhtml,()=>{}); 


                    } catch (error) {
                        console.log(error) 
                    }
                }
                xlsxparser.getGroups("./files/schedule.xlsx").then((groups)=>{
                    for (let index = 0; index < groups.length; index++) {
                        const group = groups[index];
                        tasklist.add(group)
                    }
                    generationStartTime = Math.floor(Date.now() / 1000);
                    recurseveGroupGeneration()
                })    
            })
        }
    }
}, vk.requestdelay * 1000);

var generationStartTime 
var recurseveGroupGeneration
recurseveGroupGeneration = async ()=>{
    const group = tasklist.get()
    if(!group){
        console.log("ready for: ",Math.floor(Date.now() / 1000) - generationStartTime,"sec")
        return
    }
    const timertableadress = group.timeTable
    var workdir = `./temp/${group.name}`

    if (!fs.existsSync(workdir)){
        fs.mkdirSync(workdir);
    }

    try { // TODO test shit refactory
        var pathtomainfile = await xlsxeditor.cut("./files/schedule.xlsx",`${workdir}/${group.name}.xlsx`,[timertableadress[0],timertableadress[1]])
        const address = group.address
        const groupGenerateStartTime = Math.floor(Date.now() / 1000);
        console.log("generate : ", group.name)
        const start = address[0]
        const end = address[1]

        var pathtogroupfile = await xlsxeditor.merge("./files/schedule.xlsx",pathtomainfile,[start,end],["C1"])
        var ranges = await xlsxparser.getDaysRange(pathtogroupfile)
        
        var range1 = ranges[0][1].start
        var range2 = ranges[1][1].end
        var pathtogroupfile_1 = await xlsxeditor.cut(pathtogroupfile,`${workdir}/${"1"}.xlsx`,[range1,range2])
        var pathtogroupfile_1_html = await xlsxhtml(pathtogroupfile_1,`${workdir}/${"1"}.html`)
        await htmlimage(pathtogroupfile_1_html,`${workdir}/${"1"}.png`)

        var range1 = ranges[2][1].start
        var range2 = ranges[3][1].end
        var pathtogroupfile_2 = await xlsxeditor.cut(pathtogroupfile,`${workdir}/${"2"}.xlsx`,[range1,range2])
        var pathtogroupfile_2_html = await xlsxhtml(pathtogroupfile_2,`${workdir}/${"2"}.html`)
        await htmlimage(pathtogroupfile_2_html,`${workdir}/${"2"}.png`)

        var range1 = ranges[4][1].start
        var range2 = ranges[5][1].end
        var pathtogroupfile_3 = await xlsxeditor.cut(pathtogroupfile,`${workdir}/${"3"}.xlsx`,[range1,range2])
        var pathtogroupfile_3_html = await xlsxhtml(pathtogroupfile_3,`${workdir}/${"3"}.html`)
        await htmlimage(pathtogroupfile_3_html,`${workdir}/${"3"}.png`)


        fs.unlink(pathtogroupfile_1,()=>{}); 
        fs.unlink(pathtogroupfile_1_html,()=>{}); 

        fs.unlink(pathtogroupfile_2,()=>{}); 
        fs.unlink(pathtogroupfile_2_html,()=>{}); 

        fs.unlink(pathtogroupfile_3,()=>{}); 
        fs.unlink(pathtogroupfile_3_html,()=>{}); 


        console.log("end generation ",(Math.floor(Date.now() / 1000) - groupGenerateStartTime),"sec")
        recurseveGroupGeneration()
    } catch (error) {
        console.log(error)
        recurseveGroupGeneration()  
    }
}
