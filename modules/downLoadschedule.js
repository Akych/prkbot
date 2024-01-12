const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { vk } = require("../cfg.json")

const axiosConfig = {
  headers: {
    'User-Agent': vk.userAgent,
    'Cookie':'remixmdevice=1920/1080/1/!!-!!!!!!!!;',
  },
};

const getOffset = async ()=>{
  return new Promise(async (resolve,reject) => {
    await axios.get(vk.schedule.url, axiosConfig).then(async response => {
        const $ = cheerio.load(response.data);
        const offsetNumber = $("#bt_summary").html()
        resolve(offsetNumber)
    })
  })
}

const getScheduleLink = async ()=>{
  
  var offset = await getOffset()
  offset = Math.max(Number(offset) - 19,0)

  return new Promise(async (resolve,reject) => {
    let resolvelink = ""
    await axios.get(vk.schedule.url+"?offset="+offset, axiosConfig).then(async response => {
        const $ = cheerio.load(response.data);
        const listMessages = $('.bp_post.clear_fix ')
        listMessages.each(function(index, element) {
          const message = $(element)
          const messageElement = message.find('a.page_doc_title');
          const link = "https://m.vk.com"+messageElement.attr('href');
          const parse_id = link.match(/\/doc(\d+)/)
          if(parse_id){
            const userid = parse_id[1]
            const isvalid = vk.validuserids[userid]
            if (isvalid){
              resolvelink = link
            }
          }
        })
        if(resolvelink===""){
          console.error("getScheduleLink: resolvelink not find");
          reject()
        }
        resolve(resolvelink)
    })
  })
}

const downloadFile = async (url) => {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    headers : axiosConfig.headers
  });
  response.data.pipe(fs.createWriteStream(vk.schedule.savefilepathandname));
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(vk.schedule.savefilepathandname);// kek 
    });
    response.data.on('error', (err) => {
      reject(err);
    });
  });
}


module.exports.getScheduleLink = getScheduleLink

module.exports.run = async () =>{
  return new Promise(async (resolve, reject) => {
    const link = await getScheduleLink()
    if (!link){ console.error(`No Link`); return}
    console.log("get schedule from: ",link)


    const filepath = await downloadFile(link) 
    if (fs.existsSync(filepath)) {
      console.log("save to: ",filepath)
      resolve(filepath)//kek2
    } else {
      console.error(`Error download filed ${filepath}`);
      reject()
    }
  })
}


