const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'due'], required: true },
    remarks: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
