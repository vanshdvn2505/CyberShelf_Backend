import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        default: 1,
        required: false 
    },

    batch: {
        type: Number,
        default: 2028,
        required: false,
    },

    branch: {
        type: String,
        default: "IT",
        required: false
    },

    college: {
        type: String,
        required: false
    },

    imageUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCW8ayM9K_iNzX81NSjgpGcl30jDvsTSiIg&s",
        required: false
    }

}, {timestamps: false})


const User = mongoose.model("Users", userSchema);

export default User;