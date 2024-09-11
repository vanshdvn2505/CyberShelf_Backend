import mongoose from "mongoose";

const recentsSchema = new mongoose.Schema({
    Title: {
        type: String,
    },

    URL: {
        type: String,
    },

    Type: {
        type: String,
    },

}, {timestamps: false})


const Recent = mongoose.model("Recents", recentsSchema);

export default Recent;