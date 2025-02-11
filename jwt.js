const jwt = require('jasonwebtoken');

const jwtAuthMiddleware = (req,res,next)=>{
    //Extract the jwt token from the request header we can see in postman
    //in bearer token we see the bearer then token then we split and get token
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error :'Unauthorized'});
    }
    try {
        //verify the jwt token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        //Attach user information to the request object
        req.user = decoded;//user can be any name you prefer
        next();

    } catch (err) {
        console.error(err);
        res.status(401).json({error : 'Invalid token'});
    }
}

//function to generate JWT token
const generateToken = (userData)=>{
    //Genarate a new JWT token using user data
    return jwt.sign(userData,process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware,generateToken};