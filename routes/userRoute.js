const express = require('express');
const router = express.Router();

const User = require('./../models/userSchema.js');
const { middleware, genToken } = require('./../jwt.js');


// displaying user data
router.get('/display',async (req,res)=>{

    try
    {
        const data=await User.find();

    console.log("The list of Users");
    res.status(200).json({ data: data });
    
    }catch (err) {
    
    console.log(err);
    res.status(500).json({ error: "internal server error"});
}
});

// middleware authentication routes
const auth=require('./../middleware/auth.js');

// registration endpoint
const UserController =require('./../controller/userController.js');
router.get('/register',auth.logout,UserController.signupDis);
router.post('/register',UserController.signup);


// login route
router.get('/login',auth.logout,UserController.loginDisplay);
router.post('/login',UserController.login);
router.get('/logout',UserController.logout);
router.get('/dashboard',auth.login,UserController.dash);



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