import mongoose from "mongoose";

const specificSubjectsSchema = new mongoose.Schema({
    "SubjectCode": {
        type: String,
        required: true
    },

    "QuestionPapers": [{
        "Type": String,
        "Year": String,
        "Title": String,
        "id": String,
        "URL": String
    }],

    "MODERATORS": [{
        "Contact Number": String,
        "uid": String,
        "Name": String
    }],

    "Recommended Books": [{
        "Publication": String,
        "Author": String,
        "BookTitle": String
    }],

    "Material": [{
        "Content URL": String,
        "Title": String,
        "id": String
    }],

    "Important Links": [{
        "Content URL": String,
        "Title": String
    }]
})


const SpecificSubject = mongoose.model("specificSubjects", specificSubjectsSchema);

export default SpecificSubject;