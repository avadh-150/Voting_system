const express = require('express');
const router = express.Router();

const User = require('./../models/userSchema.js');
const { middleware, genToken } = require('./../jwt.js');

// displaying user data
router.get('/',async (req,res)=>{

    try
    {
        const data=await User.find();

    console.log("The list of Users");
    res.status(200).json({ data: data });
    
    }catch (err) {
    
    console.log(err);
    res.status(500).json({ error: "internal server error"});
}
})
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        // Check if there is already an admin user

        const adminUser=await User.findOne({role:'admin'});
        if(data.role == 'admin' && adminUser)
        {
            return res.status(400).json({ message: 'There is already an admin user' });
        }
        const newUser = new User(data);

        const response = await newUser.save();


        
        // create a new payload data object
        const payload = {
            id: response.id,
        };
        const token = genToken(payload);
        // convert data object to json
        console.log(JSON.stringify(payload));
        console.log("token: " + token);
        console.log("You have successfully signed up");
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
});

// login route
router.post('/login', async (req, res) => {
    try {

        // extract aadhaar,password from req body...
        const { aadhaar, password } = req.body;

        // match aadhaar of user
        const aadhaarId = await User.findOne({ aadhaar: aadhaar });
        
        // match password of user
        const pass = await aadhaarId.comparePassword(password);
        if (!aadhaarId || !pass) {
            return res.status(401).json({ message: 'Invalid aadhaar Id or password' });
        };

        const payload = {
            id: aadhaarId.id,
        }
        const token = genToken(payload);
        console.log("token: " + token);
        res.status(200).json({ token })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// router.use(middleware)
// user profile routes
router.get('/profile',middleware, async (req, res) => {
    try {

        const data = req.user;
        console.log("the user data is; ",data);

        const id = data.id;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/profile/password', middleware, async (req, res) => {
    try {

        const id = req.user;// extract the id from the token
        const { oldPass, newPass } = req.body;

        // find the user ny userID
        const user = await User.findById(id);

        const pass = await user.comparePassword(oldPass);
        if (!pass) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        user.password = newPass;
        await User.save();

        console.log("Password has been Changed");
        res.status(200).json({ Message: "Password has been Changed" });


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;