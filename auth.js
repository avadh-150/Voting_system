const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/userSchema.js');

passport.use(new localStrategy(async (aadhaar,password,done)=>{

try{
    const user=await User.findOne({aadhaar:aadhaar});
    if(!user){
        return done(null,false),done({error:"aadhaar not found"});
    }
    const pass=user.comparePassword(password);
    if(pass){
    return done(null,user);
    }
    else
    {
        return done(null,false,done({error:"password mismatch"}));

    }

}catch(e){
return done(e);
}

}));
