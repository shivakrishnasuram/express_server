const { hash } = require("bcrypt")
const { isUtf8 } = require("buffer")
const express = require("express")
const { read } = require("fs")
const app = express()
app.use(express.json())
const fs = require("fs").promises
const bcrypt = require("bcrypt")
const { error } = require("console")



// app.use((req,res,next)=>{
//     console.log("this is middlewares")
//     if(true){
//         next()
//     }
//     else{
//         console.log("this is not comming")
//     }
// })
// app.use((req,res,next)=>{
//     console.log("this is second")
//     res.send("midddle is comming")
// })

// app.post("/postingssss",(req,res)=>{
//     res.status(200).send({"message": "it is working"})
// })

// const middle1 =(req,res,next)=>{
//     if(true){
//         next()
//     }
//     else{
//         console.log("false")
//         res.send("false")
//     }
// }
// const middle12 =(req,res,next)=>{
//     if(true){
//         next()
//     }
//     else{
//         console.log("false at middleware api 2 ")
//         res.send("false at middleware api 2 ")
//     }
// }

const usernameValidator = (req, res, next) => {
    let inputusername = req.body.username
    let regexss = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/

    if (inputusername.length <= 0) {
        res.send("username should not be empty")
    }
    else if (regexss.test(inputusername)) {
        next()
    }
    else {
        res.send("username should be currect something went wrong")
    }
}

const passwordvalidator = (req, res, next) => {
    let userpass = req.body.password
    let passwordregex = /^[a-zA-Z0-9@#$_-]{6,20}$/
    if (userpass.length <= 0) {
        res.send("userpass should be greater than 0 char")
    }
    else if (passwordregex.test(userpass)) {
        next()
    }
    else {
        res.status(404).send("something went wrong at userpass or uusername")
    }
}

const gmailvalidator = (req, res, next) => {
    let usergmail = req.body.gmail
    let gmailregex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (usergmail.length <= 0) {
        res.send("email should not be empty")
    }
    else if (gmailregex.test(usergmail)) {
        next()
    }
    else {
        res.send("something went wrong at email")
    }
}

const loginsvalidation = async (req, res, next) => {
    try {
        let { username, password, gmail } = req.body

        let filedata = JSON.parse(await ((fs.readFile("./datas.json", "utf8"))))
        const ressings = filedata.find((x) => x.username === username);
        console.log(ressings,"passcomparision")
    
        let ismatch = await bcrypt.compare(password, ressings.password)
        if (ismatch) {
            next()
        }
    }
    catch (e) {
        res.send("something at login validation middleware")
    }
}
app.post("/registration", usernameValidator, passwordvalidator, gmailvalidator, async (req, res) => {
    let { username, password, gmail } = req.body
    console.log(username, password, gmail)
    let hashedpassword = await bcrypt.hash(password, 10)
    existingData = JSON.parse(await fs.readFile("./datas.json", "utf8"))
    console.log(existingData,"this is the one")
    // existingData.push({ "username": username, "password": hashedpassword, "gmail": gmail })
    let alredyexxist = existingData.some((x) => {
        return x.username === username || x.gmail === gmail;
    });
    
    // existingData.push({ "username": username, "password": hashedpassword, "gmail": gmail })

    console.log(alredyexxist, "this is the already data")
    if (alredyexxist) {
        return res.status(404).send("userdata is alredy eisting")
    }
    else {
        existingData.push({ "username": username, "password": hashedpassword, "gmail": gmail })
        await fs.writeFile("./datas.json", JSON.stringify(existingData))
        res.send(existingData)
        console.log(existingData)
    }
    // await fs.writeFile("./taskdata.json", JSON.stringify(existingData))
    // res.send(existingData)

})
// app.put("/forgotpass",forgotpass,(req,res)=>{
//     console.log('password is fine')
// })

app.post("/login", usernameValidator, passwordvalidator, gmailvalidator, loginsvalidation, (req, res) => {
    res.send("login is fine")
})
app.listen(3000, () => {
    console.log("server is running")
})