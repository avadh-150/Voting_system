const mongoose = require('mongoose');
// bcrypt 
const bcrypt = require('bcrypt');

// mongUrl=process.env.MONGOURL;

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
       
    }, aadhaar: {
        type: Number,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'

    },
    isVoted:
    {
        type: Boolean,
        default: false
    }


});


// // perform operations when saved data
// userSchema.pre('save', async function (next) {

//     //store all info of Schema into Users....
//     const Users = this;

//     // Hash the password only if it has been modified (Or enter new passwd..)
//     //        field of Schema
//     if (!Users.isModified('password')) {
//         return next();
//     }
//     try {
//         // generate new salt for password
//         const salt = await bcrypt.genSalt(10);

//         //salt added and generated hashed password
//         const hash = await bcrypt.hash(Users.password, salt);

//         //replace password with new salted password
//         // store in schema
//         Users.password = hash;
//         next();


//     } catch (err) {
//         console.error(err);
//         return next(err);
//     }

// });

userSchema.methods.comparePassword=async function(userpass){
try
{
    const isMatch=await bcrypt.compare(userpass,this.password);
    return isMatch;
}
catch (err) {
  console.error(err);
  throw err;
}
};


module.exports = mongoose.model('Users', userSchema);

