const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, required: true },
    share: { type: String, required: true },
    joinedOn: { type: String, required: true },
    remarks: { type: String },
});

module.exports = mongoose.model('Investor', InvestorSchema);