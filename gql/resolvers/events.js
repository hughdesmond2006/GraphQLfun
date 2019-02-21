const Event = require('../../models/event');
const User = require('../../models/user');
const {transformEvent} = require('./merge');

module.exports = {              //these are resolvers...
    events: () => {
        return Event.find()
        //.populate('creator')             //mongo populate will fetch the data for any refs found
            .then(events => {
                return events.map(event => {
                    return transformEvent(event);
                });
            })
            .catch(err => {
                throw err;
            });
    },
    createEvent: (args, req) => {
        if(!req.isAuth){
            throw new Error('Bad Auth');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),      //this parses the date into proper object
            creator: req.userId       //mongoose auto converts to obj id
        });
        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = transformEvent(result);
                return User.findById(req.userId);
            })
            .then(user => {
                if(!user){
                    throw new Error('User not found');
                }
                user.createdEvents.push(event);                  //mongo accepts obj or id
                return user.save();
            })
            .then(result => {
                return createdEvent;      //_doc gives only the core properties from mongo, no boilerplate
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }
};