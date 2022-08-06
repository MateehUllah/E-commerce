const mongoose =require("mongoose");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


const userSchema= new mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true,
   
},
email:{
    type:String,
     required:true,
     unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    
},{
        timestamps:true
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12); 
    next();
  });
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
module.exports=mongoose.model("User",userSchema)