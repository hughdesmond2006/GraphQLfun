const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // //auth bypass for dev...
    // req.isAuth = true;
    // req.userId = '5c66d3d62429013dd0dff133';
    // return next();
    // //--------------------

    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    //unsplit authheader looks like -> Authorization: Bearer <tokenval>
    const token = authHeader.split(' ')[1];
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretkeysecretkey');
    } catch (e) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;    //here we extract the userId from the returned object from JWT verify
    next();
};