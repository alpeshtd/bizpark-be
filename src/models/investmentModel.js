const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
    amount: { type: String, required: true },
    status: { type: String, enum: ['paid', 'due'], default: 'due', required: true },
    remarks: { type: String },
});

module.exports = mongoose.model('Investment', InvestmentSchema);