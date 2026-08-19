const Settings = require('../models/Settings');

// Get settings
const getSettings = async (req, res) => {
    {
        let settings = await Settings.findOne();
        if (!settings){
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    };
}

const updateSettings = async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings){
        settings = await Settings.create(req.body);
    }
    else {
        settings = await Settings.findOneAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings); 
}

module.exports = {
    getSettings,
    updateSettings
}