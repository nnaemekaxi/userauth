const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "nsndvlnspvolasononfelbsviobvsvbiosvzzonposdosbsllsd";

const User = require("./models/users");

require("dotenv").config(); //allows you to use environment variables in .env
//connect to mongodb
const connect = require("./db/index");
connect();

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.post("/register", async (req, res) => {
    const fullname = req.body.fullname
    const email = req.body.email
    const password = req.body.password

    if (!email || typeof email !== "string"){
        res.render("register.ejs", {message: "Invalid Email"});
    }
    if (!password || typeof password !== "string"){
        res.render("register.ejs", {message: "Invalid Password"});
    }
    if (password.length < 9){
        res.render("register.ejs", {message: "Weak Password. Enter at least 9 characters"});
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
                                    id: Date.now().toString(),
                                    name: fullname,
                                    email: email,
                                    password: hashPassword,
                                })
        res.render("register.ejs", {message: "User created successfully"});
        res.redirect("/login");
    } catch (error) {
        if (error.code === 11000)
        
        res.redirect("/register")
        
    }
})

app.post("/login", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email:email});


    if(!user){
        res.render("login.ejs", {message: "User not found!"});
    }

    try {
        const validation = await bcrypt.compare(password, user.password)
        if(validation){
            const token = jwt.sign({
                id: user.id,
                email: user.email
            }, 
                JWT_SECRET
            )
            res.redirect("/");
        } else {
            res.render("login.ejs", {message: "Incorrect details"})
        }
    } catch (error) {
        console.log(error)
    }
    

    
})

app.get("/", (req, res) => {
    res.render("index.ejs", {name: ""});
});

app.get("/login", (req, res) => {
    res.render("login.ejs", {message: ""});
})

app.get("/register", (req, res) => {
    res.render("register.ejs", {message: ""});
})



app.listen(3000, (req, res) => {
    console.log("Server running on port 3000")
});