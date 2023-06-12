



import fs from 'fs';
import process from 'process';
import csv from 'csv-parser';
import csvParser from 'csv-parser';
import path from 'path';
import cluster from 'cluster';
import os from 'os';

const input = process.argv[process.argv.length - 1];
// console.log(input);

fs.readdir('./csvs', { recursive: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((item) => {
      console.log(item);
      a(input, item);
      if (cluster.isPrimary) {
        // a(input, item);

        for (let i = 0; i < os.cpus().length - 3; i++) {
          const worker = cluster.fork();
        }
   
      } else {
        console.log('worker is runing', process.pid);
      }
    })
  }
})


function a(input, item) {
  const old = new Date().getMilliseconds();
  const currentDir = process.cwd();
  // console.log(` ${process.pid} is running`);
  const outputPath = `${currentDir}/converted/${item}.json`;

  const readableStream = fs.createReadStream(`${currentDir}/${input}/${item}`);
  const writableStream = fs.createWriteStream(outputPath);

  readableStream.on('error', () => {
    console.log('Some issue with the readable stream');
    process.exit(1);
  });
  

  writableStream.on('error', () => {
    console.log('Some issue with the writable stream');
    process.exit(1);
  });

  writableStream.on('ready', () => {
    console.log('Conversion completed');
    
  });

  
 
  readableStream.on('ready', () => {
    console.log('read completed');
    // process.exit(1)
  });

 
  readableStream.pipe(csvParser())
  .on('data', (data) =>{
    // console.log(data)
    data = JSON.stringify(data);
    writableStream.write(`${data}\n`);
  }).on('end',() =>{
    console.log('end')
    
  })
  

  writableStream.on('close', () => {
    console.log('Conversion close');
    // process.exit()
    
  });
  // .pipe(writableStream);



  // parser.on('end', () => {
  //   writableStream.end();
  //   process.exit(1);
  // });

  // readableStream.pipe(parser).on('end', () => {
  //   console.log('Some issue with parsing the CSV file:');
  //   // process.exit(1);
  //   writableStream.close();
  //   readableStream.close()
  // });

  // const data = new Date
  const newData = new Date().getMilliseconds()

  console.log(newData - old)
 
  
}







