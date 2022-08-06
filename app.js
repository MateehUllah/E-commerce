const express=require('express');
const authRoute=require("./routes/authenticationRoute");
const userRoute=require("./routes/userRoute")
const app=express();

app.use(express.json());

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute);



module.exports=app;