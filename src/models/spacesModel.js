const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true },
        category: { type: String, required: true },
        // deposit: { type: String },
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: false, default: null },
    }
)

// spaceSchema.pre("save", async function (next) {
//     const Tenant = mongoose.model("Tenant");
//     console.log(this.isModified("tenant"))
//     if (this.isModified("tenant")) {
//         // If the `tenant` field has changed, remove the space reference from the previous tenant
//         const previousSpace = await Space.findById(this._id);
//         console.log(previousSpace)
//         if (previousSpace && previousSpace.tenant) {
//             await Tenant.findByIdAndUpdate(previousSpace.tenant, { space: null });
//         }

//         // Add the space reference to the new tenant (if not null)
//         if (this.tenant) {
//             await Tenant.findByIdAndUpdate(this.tenant, { space: this._id });
//         }
//     }

//     next();
// });


module.exports = mongoose.model('Space', spaceSchema);