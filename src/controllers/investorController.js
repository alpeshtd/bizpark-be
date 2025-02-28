const Investor = require('../models/investorModel');
const Profit = require('../models/profitModel');
const mongoose = require('mongoose');

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

const getInvestorProfit = async(req, res) => {
    try {
        const { investorId } = req.body;
        const newInvestorId = new mongoose.Types.ObjectId(investorId);
        const profits = await Profit.aggregate([
            // Match documents where at least one investor has the given _id
            {
                $match: { "splits.investors._id": newInvestorId }
            },
            // Filter only the splits that contain the investor
            {
                $project: {
                    month: 1,
                    startOfMonth: 1,
                    endOfMonth: 1,
                    splits: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$splits",
                                    as: "split",
                                    cond: {
                                        $gt: [
                                            {
                                                $size: {
                                                    $filter: {
                                                        input: "$$split.investors",
                                                        as: "investor",
                                                        cond: { $eq: ["$$investor._id", newInvestorId] }
                                                    }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            },
                            as: "split",
                            in: {
                                splitDate: "$$split.splitDate",
                                splitType: "$$split.splitType",
                                splitAmount: "$$split.splitAmount",
                                remarks: "$$split.remarks",
                                investors: {
                                    $filter: {
                                        input: "$$split.investors",
                                        as: "investor",
                                        cond: { $eq: ["$$investor._id", newInvestorId] }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);
        res.status(200).json(profits);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getInvestors, createInvestor, updateInvestor, deleteInvestor, getInvestorProfit };