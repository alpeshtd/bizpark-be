const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true},
    splits: [{
        splitDate: { type: String },
        splitAmount: { type: String },
        remarks: { type: String },
        investors: [{ 
            _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Investor'},
            name: {type: String},
            share: {type: String},
            amount: {type: String},
        }]
    }],
    startOfMonth: { type: String},
    endOfMonth: { type: String},
});

module.exports = mongoose.model('Profit', profitSchema);