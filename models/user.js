const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    createdEvents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'                        //this tells mongoose that the objectid belongs to the Event model
        }
    ]
});

module.exports = mongoose.model('User', userSchema);