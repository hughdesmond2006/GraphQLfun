const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

//trying async await...
const events = async (eventIds) => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (e) {
        throw e;
    }
};

const eventInfo = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (e) {
        throw e;
    }
};

const userInfo = (userId) => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
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