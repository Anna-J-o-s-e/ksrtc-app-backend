const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const {ksrtcsmodel}=require("./models/ksrtc")

const bcrypt=require("bcryptjs") //encryption

const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async (password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

mongoose.connect("mongodb+srv://annajose:annajose01@cluster0.d4hgr.mongodb.net/ksrtcdb?retryWrites=true&w=majority&appName=Cluster0")


//signup api
app.post("/signup",async (req,res)=>{
   let input=req.body
   let hashedPassword=await generateHashedPassword(input.password)
   console.log(hashedPassword)
   input.password=hashedPassword
   let ksrtc=new ksrtcsmodel(input)
   ksrtc.save()
   res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("server started")
})