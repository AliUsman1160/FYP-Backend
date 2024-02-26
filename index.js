const express = require("express");
require("./Config/Database");
const cors = require("cors"); //it is used to solve the frontend cors problem while hiting an API
const userController = require("./Controllers/userController");


const app= express();
app.use(cors());
app.use(express.json());

app.post("/signup", userController.signUp);
app.post("/signin", userController.signIn);
app.post("/code", userController.code);
app.get("/resend", userController.resend);
app.post("/forgetpassword", userController.forgetpassword);
app.get("/getemail", userController.getemail);
app.put("/updatepassword", userController.updatepassword);
app.get("/resendforFP", userController.resendforFP);



app.listen(5500);