const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "busName":{type:String,required:true},
        "route":{type:String,required:true},
        "busNo":{type:String,required:true},
        "drivername":{type:String,required:true}

    }
)
let busesmodel=mongoose.model("buses",schema);
module.exports={busesmodel}