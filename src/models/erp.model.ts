import mongoose from "mongoose";

const erpSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },

    No: {
        type: String,
    },

    CGPA: {
        type: String,
    },

    sem1: {
        type: String,
        default: "Awaited"
    },

    sem2: {
        type: String,
        default: "Awaited"
    },

    sem3: {
        type: String,
        default: "Awaited"
    },

    sem4: {
        type: String,
        default: "Awaited"
    },

    sem5: {
        type: String,
        default: "Awaited"
    },

    sem6: {
        type: String,
        default: "Awaited"
    },

    sem7: {
        type: String,
        default: "Awaited"
    },

    sem8: {
        type: String,
        default: "Awaited"
    },
})


const ERP = mongoose.model("ERPs", erpSchema);

export default ERP;