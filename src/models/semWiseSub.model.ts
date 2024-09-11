import mongoose from "mongoose";

const semWiseSubSchema = new mongoose.Schema({
    "IT-BI": {
        type: Array,
    },

    ECE: {
        type: Array,
    },

    IT: {
        type: Array,
    },

    yearName: {
        type: String
    }

}, {timestamps: false})


const SemWiseSub = mongoose.model("Datas", semWiseSubSchema);

export default SemWiseSub;