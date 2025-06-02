import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    _id:{ type : string, require:true},
    name:{ type : string, require:true},
    email:{ type : string, require:true},
    imageurl : { type : string, require:true},
    cartitem : { type:object, default:{}}
},{ minimize: flase })

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User