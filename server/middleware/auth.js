import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.js';
import { User } from '../models/user_db.js';

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).send({ message: 'Access denied. No Token provided'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Admin.findOne({_id: decoded.id}) | await User.findOne({_id: decoded.id})
        console.log('decoded token', decoded);
        if(!user) {
            return res.status(404).send({message: 'Unauthorized access incident will be reported.'})
        }

        req.token = token;  // attach token to request
        //attach uset to request
        req.user = user;
        next();
    } catch(err) {
        res.status(401).send({message : 'Please authenticate', error: err.message})
    }
}

export default auth;