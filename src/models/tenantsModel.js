const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        contact: { type: String, required: true },
        status: { type: String, required: true },
        rent: { type: String },
        deposit: { type: String },
        space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
        startDate: { type: String },
        endDate: { type: String },
    }
)

module.exports = mongoose.model('Tenant', tenantSchema);