const express=require('express');
const authRoute=require("./routes/authenticationRoute");
const userRoute=require("./routes/userRoute")
const productRoute=require('./routes/productRoute')
const cartRoute=require("./routes/cartRoute")
const orderRoute=require('./routes/orderRoute')
const app=express();

app.use(express.json());

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);

module.exports=app;