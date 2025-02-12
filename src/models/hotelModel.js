const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    status: { type: String, enum: ['profitSharing', 'rented'], required: true },
    rentAmount: { type: Number },
    profitPercentage: { type: Number },
    expenses: [{
        description: { type: String },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
    }],
});

module.exports = mongoose.model('Hotel', HotelSchema);
