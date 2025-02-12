const Expense = require('../models/expenseModel');
const { ObjectId } = require('mongoose').Types;

const createExpense = async (req, res) => {
    try {
        const { entityId } = req.body;
        if (!entityId) {
            req.body.entityId = null;
        }
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateExpense = async (req, res) => {
    try {
        const { entityId, _id } = req.body;
        if (!entityId) {
            req.body.entityId = null;
        }
        const expense = await Expense.updateOne({ _id }, req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


function stringIdToObjectId(filters, keys) {
    for (let key in filters) {
        if (keys.includes(key) && typeof filters[key] === 'string' && filters[key]) {
            filters[key] = new ObjectId(filters[key]);
        }
    }
    return filters;
}

const getAllExpenses = async (req, res) => {
    try {
        const { filters = {}, pagination } = req.body;
        let data;
        let total;
        let totalPages;
        if (pagination?.page && pagination.limit) {
            const skip = (pagination.page - 1) * pagination.limit;
            data = await Expense.find(filters).populate('entityId', 'name').skip(skip).limit(pagination.limit);
            total = await Expense.countDocuments(filters);
            totalPages = Math.ceil(total / limit);
        } else {
            data = await Expense.find(filters).populate('entityId', 'name');
            total = data.length;
            totalPages = 1;
        }

        const formattedFilters = stringIdToObjectId(filters, ['entityId']);
        const aggregate = await Expense.aggregate([
            { $match: { ...formattedFilters } },
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" } // Convert salary to a number
                }
            },
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$amountNumeric" },
                    totalCount: { $sum: 1 }
                }
            },
            // { $sort: { averageSalary: -1 } }
        ])
        res.status(200).json({ data, total, totalPages, currentPage: pagination?.page || 1, limit: pagination?.limit || total, aggregate });
        // const expenses = await Expense.find();
        // res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Expense.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllExpenses, createExpense, updateExpense, deleteExpense };
