
const User = require('./../models/userSchema.js');
const bcrypt = require('bcrypt');
const { middleware, genToken } = require('./../jwt.js');

const signupDis = async (req, res) => {
    try {
        res.render('register');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something is wrong to displaying" })
    }
}

const signup = async (req, res) => {
    try {
        const data = req.body;

        // Validate Aadhaar and password
        const { aadhaar, password } = req.body;

        if (aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
            return res.status(400).render('register', { msg: 'Invalid Aadhaar format' });
        }
        // if (password.length < 6) {
        //     return res.status(400).render('register', { msg: 'Password must be at least 6 characters long' });
        // }
        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role == 'admin' && adminUser) {
            return res.status(400).json({ message: 'There is already an admin user' });
        }
        // generate new salt for password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;  // Replace the plain password with the hashed one
        const newUser = new User(data);
        const response = await newUser.save();

        res.render('register', { message: 'success registration' });
        res.redirect('/user/login');
        // create a new payload data object
        // const payload = {
        //     id: response.id,
        // };
        // const token = genToken(payload);
        // // convert data object to json
        // console.log(JSON.stringify(payload));
        // console.log("token: " + token);
        // console.log("You have successfully signed up");
        // res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}


// LOGIN 

const loginDisplay = async (req, res) => {
    try {
        res.render('login');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

const login = async (req, res) => {
    try {
        // Extract Aadhaar and password from the request body
        const aadhaar = req.body.aadhaar;
        const password = req.body.password;

        if (!aadhaar || !password) {
            return res.status(400).render('login', { message: 'Aadhaar and password are required' });
        }
        // Find user by Aadhaar
        const userData = await User.findOne({ aadhaar: aadhaar });
        if (!userData) {
            return res.status(401).render('login', { message: 'Invalid Aadhaar ID or Password' });
        }

        // Compare passwords
        const pass = await userData.comparePassword(password);
        // const pass = await bcrypt.compare(password,userData.password);
        if (!pass) {
            return res.status(401).render('login', { message: 'Invalid Password or Aadhaar ID' });
        }

        // Store user in session (exclude sensitive information)
        req.session.user = userData;

        // Redirect to dashboard
        res.redirect('/user/dashboard');

    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).render('login', { message: 'Internal server error' });
    }
};





// const payload = {
//     id: aadhaarId.id,
// }
// const token = genToken(payload);
// console.log("token: " + token);
// res.status(200).json({ token })

//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ message: err.message });
//     }
// };

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/user/login')
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

const dash = async (req, res) => {
    try {
        const users= await User.findOne({_id:req.session.user._id})
        res.render('dashboard', { user: req.session.user,users:users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

module.exports = { signupDis, signup, loginDisplay, logout, login, dash };