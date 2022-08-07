const express=require("express")
const verifyToken=require("./verificationToken")
const Order=require('./../models/orderModel')
const router=express.Router()


router.post('/',verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    try{
    const newOrder= await Order.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
          order:newOrder,
        },
      });    
}catch(err){
    res.status(500).json(err);    
    }
})

router.put("/:id",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
     const updatedOrder=await Order.findByIdAndUpdate(req.params.id,req.body,{
     new: true, //this will return updated document
     runValidators: true,
   })
   if(!updatedOrder)
   {
     res.status(404).json("Bad Request")
   }
   res.status(201).json(updatedOrder)
 }
 catch(err){
     res.status(500).json(err)
 }
 })

 router.delete("/:id",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order is deleted");
    }catch(err){
    res.status(500).json(err)
    }
})

router.get("/find/:userId",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    
    try{
          const orders=await Order.find({userId:req.params.userId})
          if(!orders)
          {
            res.status(404).json("Bad Request")
          }
          res.status(200).json({
              status: 'success',
              data: {
                order,orders
              },
            });
      }catch(err){
      res.status(500).json(err)
      }
  })

  router.get("/",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
       try{
         const orders=await Order.find()
        if(!orders)
        {
          res.status(404).json("Bad Request")
        }
        res.status(200).json({
            status: 'success',
            data: {
              order:orders,
            },
          });
    }catch(err){
    res.status(500).json(err)
    }
  })
  
router.get("/income",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1))
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1))
    try{
        const income=await Order.aggregate([{
            $match:{
                createdAt:{
                    $gte:previousMonth
                }
            }},{
                $project:{
                    month:{
                        $month:"$createdAt"
                    },
                    sales:"$amount"
                }
            },{
                $group:{
                    _id:"$month",
                    total:{
                        $sum:"$sales"
                    }
                }
            }
        ])
        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err)
    }

})
module.exports=router;