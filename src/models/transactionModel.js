const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['rent', 'deposit', 'profit', 'other'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    amount: { type: String, required: true },
    status: { type: String, enum: ['paid', 'due'], default: 'due' },
    generatedOn: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    paidOn: { type: String },
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
    remarks: { type: String },
// }, { timestamps: true });
});

module.exports = mongoose.model('Transaction', TransactionSchema);
