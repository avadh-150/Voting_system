
const candidate = require('./../models/condSchema.js');
const User = require('./../models/userSchema.js');

// display the conditions
const condidate=async (req,res)=>{

    try
    {
        const data=await candidate.find();

    console.log("The list of candidates");
    res.status(200).json({ data: data });
    
    }catch (err) {
    
    console.log(err);
    res.status(500).json({ error: "internal server error"});
}
}


module.exports ={
    condidate
}