const login=async(req, res, next) => {
    try{
        if(req.session.user){}
            else{
            res.rederect("/user/login");
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"login is required"});
    }
}
const logout=async(req, res, next) => {
    try{
        if(req.session.user){
            res.redirect("/user/dashboard");
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"success login session is set"});
    }
}
// export default
module.exports={login, logout};
