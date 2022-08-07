const express=require("express")
const User=require("./../models/userModel")
const verifyToken=require("./verificationToken")
const router=express.Router()

router.put("/:id",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
   try{
    const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{
    new: true, //this will return updated document
    runValidators: true,
  })
  if(!updatedUser)
  {
    res.status(404).json("Bad Request")
  }
  res.status(201).json(updatedUser)
}
catch(err){
    res.status(500).json(err)
}
})
router.delete("/:id",verifyToken.verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User is deleted");
    }catch(err){
    res.status(500).json(err)
    }
})
router.get("/find/:id",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
    
  try{
        const user=await User.findById(req.params.id)
        if(!user)
        {
          res.status(404).json("Bad Request")
        }
        res.status(200).json({
            status: 'success',
            data: {
              user,
            },
          });
    }catch(err){
    res.status(500).json(err)
    }
})
router.get("/",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
  const query=req.query.new;
  try{
      const user=query? await User.find().sort({_id:-1}).limit(5):await User.find()
      if(!user)
      {
        res.status(404).json("Bad Request")
      }
      res.status(200).json({
          status: 'success',
          data: {
            user,
          },
        });
  }catch(err){
  res.status(500).json(err)
  }
})


router.get("/stats",verifyToken.verifyTokenAndAdmin,async(req,res)=>{
  const date=new Date();
  const lastYear=new Date(date.setFullYear(date.getFullYear()-1))
try{

const data=await User.aggregate([
  {
    $match:{
      createdAt:{
        $gt:lastYear
      }
    }
  },{
    $project:{
      month:{$month:"$createdAt"}
    }
  },{
    $group:{
      _id:"$month",
      total:{
        $sum:1
      }
    }
  }
])
if(!data)
{
  res.status(404).json("Bad Request")
}
res.status(200).json({
  status: 'success',
  data: {
    user:data,
  }
})
}catch(err){
  res.status(500).json(err)
}
})
module.exports=router;