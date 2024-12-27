
const candidate = require('./../models/condSchema.js');
const User = require('./../models/userSchema.js');
const { middleware, genToken } = require('./../jwt.js');

// display add the candidate 
const add_candidate=async(req,res)=>{
    try
    {
        res.render('addCandidate');
    }
    catch(err)
{
    console.error(err);
    res.status(500).json({ error: err.message });
}
}
//to check the role of the candidate
// const role = async (req) => {
//     try {
//         const user = await User.findById(req.session.user.id)
//         return user.role === 'admin';
//     }
//     catch (err) {
//         return false;
//     }
// }
// add the candidate
const candidate_save=async(req,res)=>{
    try {

        // if (! await role(req.user.id)) {
        //     return res.status(403).json({ error: "user does not have admin role" });
        // }
        const data = req.body;

        const image = "image/" + req.file.filename;
        data.image = image;
        const newCan = new candidate(data);

        const response = await newCan.save();

        // create a new payload data object
        // const payload = {
        //     id: response.id,
        // };
        // const token = genToken(payload);
        // // convert data object to json
        // console.log(JSON.stringify(payload));
        // console.log("token: " + token);
        console.log("You have successfully signed up");
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}


// display the conditions
const condidate=async (req,res)=>{

    try
    {
        const data=await candidate.find();
        res.render("candidate",{data:data});
    console.log("The list of candidates");
    
    }catch (err) {
    
    console.log(err);
    res.status(500).json({ error: "internal server error"});
}
}
const GiveVote=async (req, res) => {
    // user only can vote once
    const canid = req.params.candidateId;
    const userId = req.session.user.id;
    console.log(userId);
    try {
        const cand = await candidate.findById(canid);

        const user= await User.findOne({_id:req.session.user._id})
        
        // const user = await User.findById(userId);
        if (!cand) {
            return res.status(404).json({ message: "Candidate is not found" });
        }
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }
        // one does not vote again
        if (user.isVoted) {
            return res.status(404).json({ message: "you have already voted" });
        }
        // admin can not vote
        if (user.role == 'admin') {
            return res.status(403).json({ message: "admin can not vote" });
        }

        cand.vote.push({ user: user.id });
        cand.voteCount++;
        await cand.save();


        //update the user document
        user.isVoted = true;
        await user.save();
        res.redirect('/dashboard');

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });

    }
};

// count the vote 
const voteCount = async (req, res) => {
    try {
        
        //find all candidates and sort them by vote count in descending order
        const cand = await candidate.find().sort({ voteCount: 'desc' });

    // map the candidate to only return their name & vote count
        const record = cand.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        // return res.status(200).json(record);
            res.render('voteCount',{record});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
module.exports ={
    add_candidate,
    candidate_save,
    condidate,
    GiveVote,
    voteCount
}