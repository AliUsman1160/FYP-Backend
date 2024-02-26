const users = require("../Models/user");
const jwt = require("jsonwebtoken");
const sendEmail = require('./sendEmail');
const bcrypt = require("bcrypt");
const jwtKey = "FYP";
let userData={};
let verificationCode=0;
let FPEmail = null;


const signUp = async (req, res) => {
    try {
        const existingUser = await users.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).send({ already: true, error: "Email already exists" });
        } else {
            userData = req.body; 
            verificationCode = Math.floor(100000 + Math.random() * 900000);
            sendEmail(userData.email, verificationCode); 
            res.json({ success: true, message: "Email Send succefuly", email: userData.email });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

const code = async (req, res) => {
    try {
        if (req.body.forgetpassword && req.body.code) {
            if (verificationCode == req.body.code) {
                verificationCode = 0;
                return res.json({ "Verify": "Email has been verified" });
            } else {
                return res.status(400).json({ "error": "Code Error" });
            }
        }

        if (verificationCode == req.body.code && req.body.SignupEmailVerify) {
            verificationCode = 0;
            let user = new users(userData);
            let result = await user.save();
            console.log(result);

            result = result.toObject();
            delete result.password;

            if (result) {
                jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        return res.status(500).json({ "error": "Token Error" });
                    } else {
                        return res.json({ "user":result, "auth_token": token });
                    }
                });
            } else {
                return res.status(500).json({ "error": "Something went wrong" });
            }
        } else {
            return res.status(400).json({ "error": "Code Not matched" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ "error": "Something went wrong" });
    }
};


const resend = async(req,res)=>{
    verificationCode = Math.floor(100000 + Math.random() * 900000);
    sendEmail(userData.email, verificationCode); 
    res.send({ "resend": true });
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ "error": "Token Error" });
                } else {
                    res.send({ user, auth_token: token });
                }
            });
        } else {
            // Either user not found or password doesn't match
            res.send({ "error": "Invalid credentials" });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ "error": "Something went wrong" });
    }
}


const forgetpassword = async(req,res)=>{
    const existingUser = await users.findOne({ email: req.body.email });
    if (existingUser) {
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        sendEmail(req.body.email, verificationCode); 
        res.send({ resend : true });
        FPEmail = { email: req.body.email };
    } else {
        res.status(400).send({ notalready: true, error: "Email not exists. Please Signup." });
    }
}

const getemail = (req, res) => {
    if (FPEmail && FPEmail.email) {
        res.send({ email: FPEmail.email });
    } else {
        res.send({ error: "Something went wrong" });
    }
};


const updatepassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.password = password;
        await user.save();  
        res.status(200).json({ update: true });
        FPEmail={};
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const resendforFP= async(req,res)=>{
    if(FPEmail != null){
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        sendEmail(FPEmail.email, verificationCode); 
        res.send({ "resend": true, email:FPEmail.esmail });
    }
    else{
        res.send({ "notentermail": true, });
    }
}

module.exports = {
    signUp, signIn, code, resend, forgetpassword, getemail,updatepassword,resendforFP,
};
