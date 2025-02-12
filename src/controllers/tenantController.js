const Tenants = require('../models/tenantsModel');
const Spaces = require('../models/spacesModel');

const getTenants = async (req, res) => {
    try {
        const { filters = {} } = req.body;
        const tenants = await Tenants.find(filters).populate('space', 'name').sort({ status: 1 });
        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTenant = async (req, res) => {
    try {
        const { space } = req.body;
        if (!space) {
            req.body.space = null;
        }
        const tenants = await Tenants.create(req.body);
        
        res.status(201).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTenant = async (req, res) => {
    try {
        const { _id, space } = req.body;
        if (!space) {
            req.body.space = null;
        }
        const tenants = await Tenants.updateOne({ _id }, req.body);
        res.status(201).json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTenant = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Tenants.deleteOne({ _id: id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = { getTenants, createTenant, updateTenant, deleteTenant };