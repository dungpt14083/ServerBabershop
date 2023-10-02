const jwt = require('jsonwebtoken');
const Customer = require('../models/customer')
require('dotenv').config();
const hiddenString = process.env.TOKEN_SEC_KEY;

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, hiddenString);
    try {
        const customer = await Customer.findOne({_id: data._id, 'tokens.token': token});
        if (!customer) {
            throw new Error();
        }
        req.customer = customer;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({
            error: 'Not Aithorized to access this resource' +
                'module.exports=aut;'
        })
    }
}
module.exports = auth;