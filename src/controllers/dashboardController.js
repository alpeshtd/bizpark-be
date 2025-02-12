const Spaces = require('../models/spacesModel');
const Transaction = require('../models/transactionModel');
const Investment = require('../models/investmentModel');
const Investor = require('../models/investorModel');

const getDashboard = async (req, res) => {
    try {
        let spaces = await Spaces.aggregate([
            {
                $facet: {
                    totalActive: [{ $match: { status: 'active' } }, { $count: 'count' }],
                    totalCount: [{ $count: "count" }]
                },
            },
            {
                $project: {
                    totalActive: { $arrayElemAt: ["$totalActive.count", 0] },
                    totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                },
            },
        ]);
        spaces = spaces[0] || { totalActive: 0, totalCount: 0 };

        let transactions = await Transaction.aggregate([
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" } // Convert salary to a number
                }
            },
            {
                $group: {
                    _id: null, // Grouping everything together
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] }, // Condition: status is "active"
                                "$amountNumeric", // Include the amount if condition is true
                                0, // Otherwise, add 0
                            ],
                        },
                    },
                }
            }
        ]);
        transactions = transactions[0] || { totalAmount: 0 };

        let investments = await Investment.aggregate([
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" } // Convert salary to a number
                }
            },
            {
                $group: {
                    _id: null, // Grouping everything together
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] }, // Condition: status is "active"
                                "$amountNumeric", // Include the amount if condition is true
                                0, // Otherwise, add 0
                            ],
                        },
                    },
                }
            }
        ]);
        investments = investments[0] || { totalAmount: 0 };

        const investors = await Investor.countDocuments();

        res.status(201).json({ spaces, transactions, investments, investors: { totalCount: investors } })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getDashboard };