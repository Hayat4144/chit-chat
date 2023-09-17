import greet from '@utils/mom';
import fs from 'fs'

fs.readFile('nodemon.json','utf-8',(err,data)=>{
    if(err) return console.error(err.message);
    return console.info(data)
})

greet()