import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        .then(()=>{
            console.log("MongoDB Connected Successfully")
        })
        .catch((error)=> {
            console.log("MongoDB Connection Error:", error);
            process.exit(1);
        })
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

export default connectDB;