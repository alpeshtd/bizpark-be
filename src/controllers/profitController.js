const Profit = require('../models/profitModel');
const Transaction = require('../models/transactionModel');
const Expense = require('../models/expenseModel');

const createProfit = async (req, res) => {
    try {
        const { startOfMonth, endOfMonth, dateString } = req.body;
        const profit = new Profit({
            month: dateString,
            splits: [],
            startOfMonth,
            endOfMonth
        });
        await profit.save();
        res.status(201).json(profit);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const editProfit = async (req, res) => {
    try {
        const { id, splitDate, splitAmount, investors } = req.body;
        const profit = await Profit.find({ _id: id });
        if (!profit?.length) {
            res.status(400).json({ error: "Not exists" });
            return;
        }

        const updatedProfit = await Profit.findByIdAndUpdate(
            id,
            { $push: { splits: { splitDate, splitAmount, investors } }, },
            { new: true }
        );

        res.status(200).json(updatedProfit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getProfit = async (req, res) => {
    try {
        // const profit = await Profit.find({});
        // res.status(200).json(profit);

        const profit = await Profit.find({});
        if (!profit?.length) {
            res.status(200).json(profit);
            return;
        }
        // const profitAmount = [];
        const finalData = [];
        for (const data of profit) {
            const profitAmount = await Transaction.aggregate([
                { $match: { generatedOn: { $gte: data.startOfMonth, $lte: data.endOfMonth } } },
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
                { $match: { date: { $gte: data.startOfMonth, $lte: data.endOfMonth } } },
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
            const alreadySplitted = data._doc.splits?.reduce((prev, data) => {
                return +prev + +data.splitAmount
            }, 0);
            
            const currentSplitRem = +(profitAmount?.[0]?.profit && expAmount?.[0]?.expense ? profitAmount[0].profit - expAmount[0].expense : 0) - alreadySplitted;
            finalData.push({
                ...data._doc,
                profit: `${profitAmount?.[0]?.profit || 0}`,
                expense: `${expAmount?.[0]?.expense || 0}`,
                projectedProfit: `${profitAmount?.[0]?.projectedProfit || 0}`,
                projectedExpense: `${expAmount?.[0]?.projectedExpense || 0}`,
                currentSplitRem
            })
        }
        res.status(200).json(finalData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteProfit = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Profit.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createProfit, getProfit, editProfit, deleteProfit }