const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection with error handling
mongoose.connect('mongodb+srv://muhammadsinankt2004:tobe%40engg@medfinder.oga33.mongodb.net/');

// Define Schema
const StoreSchema = new mongoose.Schema({
    name: String,
    address: String,
    district: String,
    locality: String,
    phone: String,
    medicines: [String],
    availability: Boolean,
    price: Number,
    mapIframe: String,
    openingHours: String,
    rating: Number,
    latitude: Number,
    longitude: Number,
    reviewCount: Number,
    distance: Number
});

const Store = mongoose.model('Store', StoreSchema);

// Search API Endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { medicines, district, locality } = req.body;
        
        // Create search query
        const query = {};
        
        if (medicines) {
            query.medicines = { $regex: new RegExp(medicines, 'i') };
        }
        
        if (district) {
            query.district = { $regex: new RegExp(district, 'i') };
        }
        
        if (locality) {
            query.locality = { $regex: new RegExp(locality, 'i') };
        }
        
        const stores = await Store.find(query);
        
        if (stores.length > 0) {
            res.json({
                success: true,
                message: `Found ${stores.length} pharmacies with ${medicines}`,
                stores: stores
            });
        } else {
            res.json({
                success: false,
                message: 'No pharmacies found with the specified medicine in your area',
                stores: []
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while searching for medicines',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});