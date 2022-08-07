const express=require("express")
const verifyToken=require("./verificationToken")
const Cart=require('./../models/cartModel')
const router=express.Router()
router.post('/',verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    try{
    const newCart= await Cart.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
          Cart:newCart,
        },
      });    
}catch(err){
    res.status(500).json(err);    
    }
})

router.put("/:id",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    try{
     const updatedCart=await Cart.findByIdAndUpdate(req.params.id,req.body,{
     new: true, //this will return updated document
     runValidators: true,
   })
   if(!updatedCart)
   {
     res.status(404).json("Bad Request")
   }
   res.status(201).json(updatedCart)
 }
 catch(err){
     res.status(500).json(err)
 }
 })

 router.delete("/:id",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart is deleted");
    }catch(err){
    res.status(500).json(err)
    }
})

router.get("/find/:userId",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    
    try{
          const cart=await Cart.find({userId:req.params.userId})
          if(!cart)
          {
            res.status(404).json("Bad Request")
          }
          res.status(200).json({
              status: 'success',
              data: {
                cart,
              },
            });
      }catch(err){
      res.status(500).json(err)
      }
  })

  router.get("/",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
    const carts=await Cart.find()
    if(!carts)
    {
      res.status(404).json("Bad Request")
        }
        res.status(200).json({
            status: 'success',
            data: {
              cart:carts,
            },
        });
    }catch(err){
    res.status(500).json(err)
    }
  })
module.exports=router;