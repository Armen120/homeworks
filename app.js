import fs from 'fs';
import { spawn } from 'child_process';


async function tread(command, opshArr, time = Infinity) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '-');
    let startData = new Date().getTime();
    return new Promise((res, rej) => {
        const child = spawn(command, opshArr);
        child.on('close', () => {
            let endTime = new Date().getTime();
            const propartis = {
                start: timestamp,
                duration: 0,
                success: false,
                error: ''
            }

            propartis.duration = endTime - startData;
            propartis.success = true;

            res(propartis);
            saveProprtys(propartis, command);
        })

        child.on('error', (err) => {
            let endTime = new Date().getTime();
           
            propartis.duration = endTime - startData;
            
                const propartis = {
                    start: timestamp,
                    duration: 0,
                    success: false,
                    commandSuccess: false,
                    error: ''
                }
                propartis.error = err.message;
                res(propartis);
                saveProprtys(propartis, command);
                
            
        })

        if (time !== Infinity) {
            setTimeout(() => {
                child.kill();
            }, time);
        }

    })

   async function saveProprtys(proprtys, command) {
      
        const filename = `log/${timestamp}${command}.json`;
        const data = JSON.stringify(proprtys);
       fs.writeFile(filename, data, (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Statistic saved for ${command}`);
            }
        });
    }
}

tread('cmd.exe', ['/c','dir'], 2000).then(prop => {
    console.log(prop);
});












