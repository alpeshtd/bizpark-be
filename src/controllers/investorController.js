const Investor = require('../models/investorModel');

const createInvestor = async (req, res) => {
    try {
        const investor = new Investor(req.body);
        await investor.save();
        res.status(201).json(investor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateInvestor = async (req, res) => {
    try {
        const { _id } = req.body;
        const investor = await Investor.updateOne({ _id }, req.body);
        res.status(201).json(investor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getInvestors = async (req, res) => {
    try {
        const { filters = {} } = req.body;
        const investors = await Investor.find(filters);
        res.status(200).json({data: investors});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteInvestor = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Investor.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getInvestors, createInvestor, updateInvestor, deleteInvestor };