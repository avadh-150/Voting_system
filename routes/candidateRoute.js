const express = require('express');
const router = express.Router();

const candidate = require('./../models/condSchema.js');
const User = require('./../models/userSchema.js');
const { middleware, genToken } = require('./../jwt.js');

const role = async (id) => {
    try {
        const user = await User.findById(id)
        return user.role === 'admin';
    }
    catch (err) {
        return false;
    }
}
// add the candidate
router.post('/', async (req, res) => {
    try {

        if (! await role(req.user.id)) {
            return res.status(403).json({ error: "user does not have admin role" });
        }
        const data = req.body;
        const newCan = new candidate(data);

        const response = await newCan.save();
        // create a new payload data object
        const payload = {
            id: response.id,
        };
        const token = genToken(payload);
        // convert data object to json
        console.log(JSON.stringify(payload));
        console.log("token: " + token);
        console.log("You have successfully signed up");
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
});

router.put('/:candidateId', middleware, async (req, res) => {
    try {
        if (!role(req.user.id)) {
            return res.status(403).json({ error: "user does not have admin role" });
        }

        const cid = req.params.candidateId;
        const data = req.body;

        const save = await candidate.findByIdAndUpdate(cid, data, {
            new: true,
            runValidators: true
        });
        if (!save) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate has been updated");
        res.status(200).json({ response: save });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});


//delete candidate
router.delete('/:candidateId', middleware, async (req, res) => {
    try {
        if (!role(req.user.id)) {
            return res.status(403).json({ error: "user does not have admin role" });
        }

        const cid = req.params.candidateId;

        const save = await candidate.findByIdAndDelete(cid);
        if (!save) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate has been deleted");
        res.status(200).json({ Message: "candidate data is deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});



// let's vote
router.post('/vote/:candidateId', async (req, res) => {
    // user only can vote once
    const canid = req.params.candidateId;
    const userId = req.user.id;
    try {
        const cand = await candidate.findById(canid);

        const user = await User.findById(userId);
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

        cand.vote.push({ user: userId });
        cand.voteCount++;
        await cand.save();


        //update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "votes are give to your requested party" });



    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });

    }
});

// middleware authentication routes
const auth=require('./../middleware/auth.js');

const condcont=require('./../controller/candCont.js');
router.get('/candidate',auth.login,condcont.condidate);

// vote count
router.get('/vote/count', async (req, res) => {
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

        return res.status(200).json(record);


    } catch (err) {
        console.log(err);
        return res.status(500).json({ Error: "internal server Error.." });

    }
})

module.exports = router;