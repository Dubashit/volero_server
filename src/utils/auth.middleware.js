require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken');


async function authenticateUser(username, password) {
    try {
        const user = await User.findAll({ where: { username: username } });
        if (!user || user.length === 0) {
            return null;
        }

        const hashedPassword = user[0].password;

        if (!bcrypt.compareSync(password, hashedPassword)) {
            return null; 
        }
        const token = await generateAccessToken(user[0]);
        return token;
        
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    }catch(error){
        res.status(401).json({message: "Unauthorized"})
    }
}

async function generateAccessToken(user){
    const options = {
        noTimestamp:true
    }
    try {
        const tokenPayload = {
            id: user.id,
            username: user.username
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, options);
        return token;
    } catch (error) {
        console.error('Error generating access token:', error);
        return null;
    }
}



module.exports ={
    authenticateUser,
    authenticateJWT,
    generateAccessToken
}