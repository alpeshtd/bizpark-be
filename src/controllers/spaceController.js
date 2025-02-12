const Spaces = require('../models/spacesModel');
const Tenants = require('../models/tenantsModel');

const getSpaces = async (req, res) => {
    try {
        // const spaces = await Spaces.find({}).populate('tenant', 'name');
        const spaces = await Spaces.aggregate([
            {
                // $lookup: {
                //     from: "transactions",
                //     localField: "_id",
                //     foreignField: "space",
                //     as: "transactions"
                // }
                $lookup: {
                    from: 'transactions',
                    let: { space: '$_id' },
                    as: "transactions",
                    pipeline: [
                        { $match: { $expr: { $eq: ['$space', '$$space'] } } },
                        {
                            $addFields: {
                                amountNumeric: { $toDouble: "$amount" } // Convert salary to a number
                            }
                        },
                        {
                            $group: {
                                _id: '$status',
                                totalAmount: { $sum: "$amountNumeric" },
                                totalCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "tenants",
                    localField: "tenant",
                    foreignField: "_id",
                    as: "tenant"
                }
            },
            {
                $unwind: {
                    path: "$tenant", // Unwind the owner array
                    preserveNullAndEmptyArrays: true // Include spaces without an owner
                }
            }
        ]);
        res.status(200).json(spaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSpace = async (req, res) => {
    try {
        const { tenant } = req.body;
        if (!tenant) {
            req.body.tenant = null;
        }
        const space = new Spaces(req.body);
        await space.save();
        if (req.body.tenant) {
            await Tenants.findByIdAndUpdate(req.body.tenant, { space: space._id });
        }
        res.status(201).json(space);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSpace = async (req, res) => {
    try {
        const { _id, tenant } = req.body;
        if (!tenant) {
            req.body.tenant = null;
        }
        const previousSpace = await Spaces.findById(_id)
        const tId = previousSpace.tenant ? previousSpace.tenant.toString() : null;
        if (previousSpace && tId !== req.body.tenant) {;
            if (previousSpace.tenant) {
                await Tenants.findByIdAndUpdate(previousSpace.tenant, { space: null });
            }
            
            // Add the space reference to the new tenant (if not null)
            if (req.body.tenant) {
                await Tenants.findByIdAndUpdate(req.body.tenant, { space: _id });
            }
        }
        const space = await Spaces.updateOne({ _id }, req.body);
        res.status(201).json(space);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteSpace = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Spaces.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getSpaces, createSpace, deleteSpace, updateSpace };