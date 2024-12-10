const mongoose = require('mongoose');

// mongUrl=process.env.MONGOURL;

const candidateSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    party:
    {
        type: String,
        require: true
    },
    age: {
        type: Number,
        required: true
    },
    vote: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,// get _id
                ref:'User',// reference to user named document
                required:true
            },
            voteAt:{
                type:Date,
                default:Date.now()//today date
            }
        }
    ],

    voteCount:
    {
        type: Number,
        default:0
    }
    
});

module.exports = mongoose.model('candidate', candidateSchema);
