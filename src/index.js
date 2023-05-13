const http = require('http');
const fs = require('fs');
const path = require('path');
const requests = require('requests');
const express = require('express');
const app = express();

require('dotenv').config();
const myApi =process.env.API;
let city = 'noida';
const stpath = path.join(__dirname,"../public/main.html");
const mainfile = fs.readFileSync("./public/main.html" , "utf-8");    


app.use(express.urlencoded());

app.get('/',(req,res,next)=>{
    if(req.url == "/"){
        requests(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myApi}`
        )
        .on("data", (chunk) => {
            const tempchunk = JSON.parse(chunk);
            const arrays = [tempchunk];
            const realdata = arrays.map((val) => replaceval(mainfile , val)).join("");
            // app.use(express.static(stpath));
            res.write(realdata);
            // console.log(realdata);
        })
        .on("end",(err) => {
            console.log("inside end ");
            // if(err) return console.log("connection was interrupted due to ", err);
            
            res.end();
        });
    }
    // res.send(mainfile);
});
app.use(express.static(stpath));
app.post('/',(req,res,next)=>{
    city = req.body.cityy
    if(req.url == "/"){
                requests(
                    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myApi}`
                )
                .on("data", (chunk) => {
                    const tempchunk = JSON.parse(chunk);
                    const arrays = [tempchunk];
                    const realdata = arrays.map((val) => replaceval(mainfile , val)).join("");
                    res.write(realdata);
                    // console.log(realdata);
                })
                .on("end",(err) => {
                    console.log("inside end ");
                    // if(err) return console.log("connection was interrupted due to ", err);
                    
                    res.end();
                });
            }
});

app.listen(8000);

const replaceval = (orgn,val)=>{
    console.log("inside replace");
    let tempi = orgn.replace("{%tempe%}" , val.main.temp);
    tempi = tempi.replace("{%cityloc%}" , val.name);
    tempi = tempi.replace("{%counloc%}" , val.sys.country);
    tempi = tempi.replace("{%mint%}" , val.main.temp_min);
    tempi = tempi.replace("{%maxt%}" , val.main.temp_max);
    tempi = tempi.replace("{%imgstst%}" , val.weather[0].main);
    console.log(val.weather[0].main);
    return tempi;
}
// const server = http.createServer((req,res) =>{
//     // console.log("inside");
//     
// });

// server.listen(8080, "127.0.0.1");