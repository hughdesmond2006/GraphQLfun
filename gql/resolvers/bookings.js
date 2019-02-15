const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformBooking, transformEvent} = require('./merge');

module.exports = {             //these are resolvers...
    bookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Bad Auth');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(function(booking) {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Bad Auth');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Bad Auth');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    },
};