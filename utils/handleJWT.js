const jsonWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = async (user) => {
    const sign = await jsonWT.sign(
        { 
            _id: user._id,
            role: user.role 
        }, 
        JWT_SECRET, 
        { 
            expiresIn: '1h' 
        }
    );
    return sign;
}

const verifyToken = async (tokenJWT) => {
    try{
        return jsonWT.verify(tokenJWT, JWT_SECRET);
    } catch(e){
        return null;
    }
}

module.exports = { tokenSign, verifyToken }