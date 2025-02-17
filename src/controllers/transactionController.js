const Transaction = require('../models/transactionModel');
const Tenants = require('../models/tenantsModel');
const { ObjectId } = require('mongoose').Types;

const createTransaction = async (req, res) => {
    try {
        const { type, entityId } = req.body;
        if (['rent', 'deposit', 'profit'].includes(type) && !entityId) {
            res.status(500).json({ error: 'Entity is required!' });
            return;
        }
        if (entityId) {
            const tenant = await Tenants.findById(entityId);
            if (tenant) {
                req.body.space = tenant.space;
            }
        } else {
            req.body.entityId = null;
        }
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const createManyTransaction = async (req, res) => {
    try {
        const { transactions } = req.body;
        if(transactions?.length) {
            transactions.forEach(async (tran, ind) => {
                const {type, entityId} = tran;
                if (['rent', 'deposit', 'profit'].includes(type) && !entityId) {
                    res.status(500).json({ error: 'Entity is required for All...!' });
                    return;
                }
            })
        }

        const transaction = await Transaction.insertMany(transactions);
        // await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { type, entityId, _id } = req.body;
        if (['rent', 'deposit', 'profit'].includes(type) && !entityId) {
            res.status(500).json({ error: 'Entity is required!' });
            return;
        }
        if (entityId) {
            const tenant = await Tenants.findById(entityId);
            if (tenant) {
                req.body.space = tenant.space;
            }
        } else {
            req.body.entityId = null;
        }
        const transaction = await Transaction.updateOne({ _id }, req.body);
        res.status(201).json(transaction);
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

const getAllTransactions = async (req, res) => {
    try {
        const { filters = {}, pagination } = req.body;
        let data;
        let total;
        let totalPages;
        if (pagination?.page && pagination.limit) {
            const skip = (pagination.page - 1) * pagination.limit;
            data = await Transaction.find(filters).sort({ generatedOn: -1 }).populate('entityId', 'name').populate('space', 'name').skip(skip).limit(pagination.limit);
            total = await Transaction.countDocuments(filters);
            totalPages = Math.ceil(total / limit);
        } else {
            data = await Transaction.find(filters).sort({ generatedOn: -1 }).populate('entityId', 'name').populate('space', 'name');
            total = data.length;
            totalPages = 1;
        }
        
        const formattedFilters = stringIdToObjectId(filters, ['space', 'entityId']);
        const aggregate = await Transaction.aggregate([
            { $match: { ...formattedFilters } },
            { $sort: { generatedOn: -1 }},
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Transaction.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllTransactions, createTransaction, updateTransaction, createManyTransaction, deleteTransaction };