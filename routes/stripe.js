const express=require("express");
const stripe=require("stripe")(process.env.STRIPE_KEY);
const router=express.Router();
router.post("/payment",(req,res)=>{
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        curreny:"usd",
    },
    (stripeErr,stripeRes)=>{
        if(stripeErr){
        res.status(500).jaon()
        }else{
            res.status(200).json(stripeRes)
        }
    })
})

module.exports=router