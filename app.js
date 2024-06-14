const mongoose=require("mongoose")
const express=require("express")
const cors=require("cors")
const {ksrtcsmodel}=require("./models/ksrtc")
const jwt=require("jsonwebtoken")

const bcrypt=require("bcryptjs") //encryption
const { busesmodel } = require("./models/bus")

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

//signin api
app.post("/signin",(req,res)=>{
    let input=req.body
    ksrtcsmodel.find({"email":req.body.email}).then((response)=>{
        if (response.length>0) {
          let dbPassword=response[0].password
          console.log(dbPassword)
          bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
            if (isMatch) {
                jwt.sign({email:input.email},"ksrtc-app",{expiresIn:"1d"},(error,token)=>{
                    if (error) {
                        res.json({"status":"Unable To create Token"})
                    } else {
                       res.json({"status":"success","userId":response[0]._id,"token":token}) 
                    }
                })
                
            } else {
               res.json({"status":"Incorrect Password"}) 
            }
          })  
        } else {
         res.json({"status":"User Not Found"})   
        }
    }).catch()
})


app.post("/viewusers",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"ksrtc-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"Unauthorized access"})
        } else {
            if (decoded) {
             ksrtcsmodel.find().then(
                (response)=>{
                    res.json(response)
                }
             ).catch()   
            }
        }
    })
})

app.post("/add",(req,res)=>{
    let input=req.body
    let bus=new busesmodel(input)
    bus.save()
    console.log(bus)
    res.json({"status":"success"})
})

app.post("/view",(req,res)=>{
    busesmodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch((error)=>{
        res.json(error)
    })
})

app.listen(8080,()=>{
    console.log("server started")
})