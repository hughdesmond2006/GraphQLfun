const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {             //these are resolvers...
    createUser: (args) => {
        return User.findOne({email: args.userInput.email})          //only bad connection stops going to then block...
            .then(user => {
                if (user) {
                    throw new Error('User exists');
                }
                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc, password: null, _id: result.id};
            })
            .catch(err => {
                throw err;
            });
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error('User not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);       //compares hashed pw with hashed pw
        if(!isEqual){
            throw new Error('PW incorrect!');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'secretkeysecretkey', {
            expiresIn: '1h'
        });
        return {userId: user.id, token: token, tokenExpiration: 1};
    },
};