import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: [true, "Username Already taken"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Account Already exist with this email"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})  

const User = mongoose.model("User",userSchema);

export default User;