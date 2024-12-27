const express = require('express');
const router = express.Router();

const multer=require('multer');
const candidate = require('./../models/condSchema.js');
const User = require('./../models/userSchema.js');
const { middleware, genToken } = require('./../jwt.js');

// add the candidate


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



// path from path module
const path = require('path');

// import multers
//middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // cb means callback function..
        cb(null, path.join(__dirname, '../public/image')); // add img path with public
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


// middleware authentication routes
const auth=require('./../middleware/auth.js');
const condcont=require('./../controller/candCont.js');
// Routes
// add the candidate
router.get('/add-candidate',condcont.add_candidate)
router.post('/add-candidate',upload.single('image'),condcont.candidate_save)

router.get('/candidate',auth.login,condcont.condidate);
router.get('/vote/:candidateId',auth.login,condcont.GiveVote);

//count the vote 
router.get('/vote',auth.login,condcont.voteCount);

module.exports = router;