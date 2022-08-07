const express=require("express")
const verifyToken=require("./verificationToken")
const Product=require('./../models/productModel')
const router=express.Router()
router.post('/',verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
    const newProduct= await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
          product:newProduct,
        },
      });    
}catch(err){
    res.status(500).json(err);    
    }
})

router.put("/:id",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
     const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{
     new: true, //this will return updated document
     runValidators: true,
   })
   if(!updatedProduct)
   {
     res.status(404).json("Bad Request")
   }
   res.status(201).json(updatedProduct)
 }
 catch(err){
     res.status(500).json(err)
 }
 })

 router.delete("/:id",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product is deleted");
    }catch(err){
    res.status(500).json(err)
    }
})

router.get("/find/:id",async(req,res)=>{
    
    try{
          const product=await Product.findById(req.params.id)
          if(!product)
          {
            res.status(404).json("Bad Request")
          }
          res.status(200).json({
              status: 'success',
              data: {
                product,
              },
            });
      }catch(err){
      res.status(500).json(err)
      }
  })

  router.get("/",async(req,res)=>{
    const qNew=req.query.new;
    const qCategory=req.query.category
    try{
        let products;
        if(qNew)
        {
        products=await Product.find().sort({createdAt:-1}).limit(5)
        }
        else if(qCategory)
        {
            products=await Product.find({categories:{
                $in:[qCategory]
            }})
        }else{
            products=await Product.find()
        }
        if(!products)
        {
          res.status(404).json("Bad Request")
        }
        res.status(200).json({
            status: 'success',
            data: {
              product:products,
            },
          });
    }catch(err){
    res.status(500).json(err)
    }
  })
  
  
module.exports=router;