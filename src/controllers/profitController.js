const Profit = require('../models/profitModel');
const Transaction = require('../models/transactionModel');
const Expense = require('../models/expenseModel');

const createProfit = async (req, res) => {
    try {
        const { startOfMonth, endOfMonth, dateString } = req.body;
        const isProfit = await Profit.find({ month: dateString});
        if(isProfit?.length) {
            res.status(400).json({ error: "already exists"});
            return;
        }
        const profitAmount = await Transaction.aggregate([
            { $match: { generatedOn: { $gte: startOfMonth, $lte: endOfMonth }, status: 'paid' } },
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" }
                }
            },
            {
                $group: {
                    _id: null, // Grouping everything together
                    profit: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] }, // Condition: status is "active"
                                "$amountNumeric", // Include the amount if condition is true
                                0, // Otherwise, add 0
                            ],
                        },
                    },
                    projectedProfit: {
                        $sum: "$amountNumeric",
                    },
                }
            }
        ]);
        const expAmount = await Expense.aggregate([
            { $match: { date: { $gte: startOfMonth, $lte: endOfMonth }, status: 'paid' } },
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" }
                }
            },
            {
                $group: {
                    _id: null, // Grouping everything together
                    expense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] }, // Condition: status is "active"
                                "$amountNumeric", // Include the amount if condition is true
                                0, // Otherwise, add 0
                            ],
                        },
                    },
                    projectedExpense: {
                        $sum: "$amountNumeric",
                    },
                }
            }
        ]);
        const currentSplitRem = profitAmount?.[0]?.profit && expAmount?.[0]?.expense ? profitAmount[0].profit - expAmount[0].expense : 0;

        const profit = new Profit({
            month: dateString,
            profit: `${profitAmount?.[0]?.profit || 0}`,
            expense: `${expAmount?.[0]?.expense || 0}`,
            projectedProfit: `${profitAmount?.[0]?.projectedProfit || 0}`,
            projectedExpense: `${expAmount?.[0]?.projectedExpense || 0}`,
            splits: [],
            currentSplitRem,
        });
        await profit.save();
        res.status(201).json(profit);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getProfit = async (req, res) => {
    try{
        const profit = await Profit.find({});
        res.status(200).json(profit);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createProfit, getProfit }