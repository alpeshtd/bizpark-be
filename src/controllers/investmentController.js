const Investment = require('../models/investmentModel');
const { stringIdToObjectId } = require('../utils/utils');

const createInvestment = async (req, res) => {
    try {
        const investment = new Investment(req.body);
        await investment.save();
        res.status(201).json(investment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateInvestment = async (req, res) => {
    try {
        const { _id } = req.body;
        const investment = await Investment.updateOne({ _id }, req.body);
        res.status(201).json(investment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getInvestments = async (req, res) => {
    try {
        // const { filters = {} } = req.body;
        // const investments = await Investment.find(filters).populate('investorId', 'name');;
        // res.status(200).json({ data: investments });

        const { filters = {}, pagination } = req.body;
        let data;
        let total;
        let totalPages;
        if (pagination?.page && pagination.limit) {
            const skip = (pagination.page - 1) * pagination.limit;
            data = await Investment.find(filters).sort({ date: -1}).populate('investorId', 'name').skip(skip).limit(pagination.limit);
            total = await Investment.countDocuments(filters);
            totalPages = Math.ceil(total / limit);
        } else {
            data = await Investment.find(filters).sort({ date: -1}).populate('investorId', 'name');
            total = data.length;
            totalPages = 1;
        }

        const formattedFilters = stringIdToObjectId(filters, ['investorId']);
        const aggregate = await Investment.aggregate([
            { $match: { ...formattedFilters } },
            { $sort: { date: -1}},
            {
                $addFields: {
                    amountNumeric: { $toDouble: "$amount" }
                }
            },
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$amountNumeric" },
                    totalCount: { $sum: 1 }
                }
            },
        ])
        res.status(200).json({ data, total, totalPages, currentPage: pagination?.page || 1, limit: pagination?.limit || total, aggregate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteInvestment = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Investment.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getInvestments, createInvestment, updateInvestment, deleteInvestment };