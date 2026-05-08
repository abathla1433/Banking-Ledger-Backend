const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:[true,"email already exists"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minLength:[6,"password should be at least 6 characters"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next;    
    }
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash;
    next;
});


userSchema.methods.comparePassword=async function(password){
    console.log(password);
    console.log(this.password);
    return await bcrypt.compare(password,this.password);
}

const userModel=mongoose.model("User",userSchema);
module.exports=userModel;