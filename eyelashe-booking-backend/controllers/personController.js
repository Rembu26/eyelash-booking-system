const Person = require('../models/Person');
const bcrypt = require('bcrypt')

// @desc    Get all persons, filter by role
// @route   GET /api/persons
const getAllPersons = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};

        const persons = await Person
            .find(filter)
            .select('FirstName LastName avatar') // keep _id for react keys
            .lean();

        // Add Full name field for front end
        const withFullName = persons.map(p => ({
            ...p,
            fullName: `${p.FirstName} ${p.LastName}`
        }));

        res.json(withFullName);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get logged in user profile
// @route   GET /api/persons/me
const getMe = async (req, res) => {
    try {
        // req.user is populated by the authentication middleware
        const user = await Person
            .findById(req.user.id)
            .select('FirstName LastName email role avatar');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            ...user.toObject(),
            fullName: `${user.FirstName} ${user.LastName}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// @desc    Get all customers + walk-ins
// @route   GET /api/people/clients
const getClients = async (req, res) => {
    try {
        const clients = await Person.find({ 
            role: { $in: ['customer', 'walk-in'] },
           status:'active'

        })
        .select('FirstName LastName PhoneNumber email role status')
        .sort({ createdAt: -1 });

        // Add default status if it doesn't exist
        const clientsWithStatus = clients.map(c => ({
            ...c.toObject(),
            status: c.status || 'active' // <--- if no status, make it active
        }));

        

        res.status(200).json(clientsWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//For the toggle/tabs
const toggleClientStatus = async (req,res) =>{
    try{
        const client = await Person.findById(req.params.id);
        if(!client)
            return res.status(404).json({error: 'Client not found'});

        client.status = client.status === 'active' ? 'inactive': 'inactive';
        await client.save();

        res.json({message:`Client set to ${client.status}`,client});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

const upgradeWalkIn = async (req,res) => {
    try{
        const {email,password} = req.body;
        const client = await Person.findById(req.params.id);

        if(!client)
            return res.status(404).json({error:'Client not found'});

        if (client.role !== 'walk-in')
            return res.status(400).json({error:'Only walk-ins can be upgraded'});

        //check if email already exists
        const existing = await Person.findOne({email});

        if(existing)
            return res.status(400).json({error: 'Email slready in use'});

        const passwordHash = await bcrypt.hash(password,10);
        client.role = 'customer';
        client.email = email.toLowerCase();
        client.passwordHash= passwordHash;
        client.isWalkIn= false;

        await client.save();
        res,json({message: 'Client successfully upgraded to customer',client})

    }catch(err){
        res.status(500).json({error:err.message});
    }
}

module.exports = { 
    getClients, // from before
    getAllPersons,
    getMe,
    toggleClientStatus,
    upgradeWalkIn
};