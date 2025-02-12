const Hotel = require('../models/hotelModel');

const createHotel = async(req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getHotel = async(req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (error) {
        res.status(404).json({ error: 'Hotel not found' });
    }
}

module.exports = { getHotel, createHotel };