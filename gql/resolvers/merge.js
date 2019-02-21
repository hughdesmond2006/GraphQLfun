//dataloader combines multiple requests for a single ID into one request, for efficiency
const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}});     //returns a promise which dataloader needs
});

//trying async await..
//The order the events are returned is important for dataloader to know which data matches which ID
const events = async (eventIds) => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        events.sort((a,b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
        });

        return events.map(event => {
            return transformEvent(event);
        });
    } catch (e) {
        throw e;
    }
};

const eventInfo = async (eventId) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (e) {
        throw e;
    }
};

const userInfo = (userId) => {
    //important to pass ID's as strings (not objectID's) to dataloader, or the internal comparison will fail
    return userLoader.load(userId.toString())
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)         //TODO get this working: () => eventLoader.loadMany(user._doc.createdEvents)
            };    //get doc but overwrite the id
        })
        .catch(err => {
            throw err;
        });
};

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event._doc._id.toString(),
        date: dateToString(event._doc.date),
        creator: userInfo.bind(this, event._doc.creator)
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: userInfo.bind(this, booking._doc.user),
        event: eventInfo.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;