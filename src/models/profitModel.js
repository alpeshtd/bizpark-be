const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true},
    profit: { type: String, required: true},
    expense: { type: String, required: true},
    projectedProfit: { type: String, required: true},
    projectedExpense: { type: String, required: true},
    splits: [{
        splitDate: { type: String },
        splitAmount: { type: String },
        remarks: { type: String },
        investors: [{ 
            _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Investor'},
            share: {type: String},
            amount: {type: String},
        }]
    }],
    currentSplitRem: { type: String },
});

module.exports = mongoose.model('Profit', profitSchema);