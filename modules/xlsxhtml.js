const { spawn } = require('child_process');
module.exports = async (xlsxfilepath,outfile)=>{
    return new Promise(function(resolve, reject) {
        const pyprog = spawn('python',["./modules/python/run_xlsx2html.py",xlsxfilepath,outfile]);
        pyprog.stdout.on('data', function(data){
            resolve(outfile)
        });
        pyprog.stderr.on('data', function(data){
            reject(data.toString())
        });
    })
}

