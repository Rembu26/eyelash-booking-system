const Person = require('../models/Person');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            role: { $in: ['customer', 'walk-in'] }
           

        })
        .select('FirstName LastName PhoneNumber email role status')
        .sort({ createdAt: -1 });

        // Add default status if it doesn't exist
        const clientsWithStatus = clients.map(c => ({
            ...c.toObject()
             // <--- if no status, make it active
        }));

        

        res.status(200).json(clientsWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


//@desc EDIt a client - name,phone,email,role
// @route PUT/api/person/Lid
//@ access admin
const editPerson = async (req,res) =>{
    try{
        const {id} = req.params;
        const{FirstName,LastName,PhoneNumber,email,role} = req.body;
        const person = await Person.findById(id);


        if(!person) {
                return res.status(404).json({message: 'Person not found'});
            }

        //1.checks if the new email is used by someone
        if(email){
            const cleanEmail = email.toLowerCase().trim();
            const existingEmail = await Person.findOne({
                email:cleanEmail,
                _id :{$ne:id} //exclude current person
            });

            if(existingEmail)
                return  res.status(400).json({message: 'Email aleady in use'});
            person.email = cleanEmail;
        }
        //Checks if phone is already used by anothe CUSTOMER
        //Only blocking this for customers to allown multipe walk-ins with the same number
        if(PhoneNumber && role === 'customer'){
            const exisitingPhone = await Person.findOne({
                PhoneNumber,
                role:'customer',
                _id:{$ne: id}
            });
            
            if(exisitingPhone)
                return res.status(400).json({message:'Phone already in use by another customer'});
            person.PhoneNumber = PhoneNumber;
        }
        else if(PhoneNumber){
            person.PhoneNumber = PhoneNumber;
        }

        //Update other fields
        person.FirstName = FirstName || person.FirstName;
        person.LastName = LastName || person.LastName;
        person.role = role || person.role;

        await person.save();
        res.json({message:'Client updated successfully',person})
    }catch(err){
        console.error(err);
        if(err.code === 11000)
            return res.status(400).json({message:'Duplicate field'}); // mongo unique index error
        res.status(500).json({message:'Server Error'});
    }
}

// @desc    Soft Delete: Set status to 'deactive'
// @route   PATCH /api/persons/:id/deactivate
// @access  Admin
const deactivatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    // Soft delete - don't actually delete from DB
    person.status = 'inactive'; 
    await person.save();

    res.json({ 
      message: `Client deactivated successfully`,
      status: person.status 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @desc    Reactivate: Set status back to 'active'
// @route   PATCH /api/persons/:id/reactivate
// @access  Admin
const reactivatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    if (!person) return res.status(404).json({ message: 'Person not found' });

    // Can only reactivate if they were deactive
    if(person.status !== 'inactive') {
      return res.status(400).json({ message: 'Only deactivated clients can be reactivated' });
    }

    person.status = 'active';
    await person.save();

    res.json({ 
      message: `Client reactivated successfully`,
      status: person.status 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
 const upgradeToCustomer = async (req,res) =>{
    console.log("Body Receieved: ",req.body)
    try{
        const {tempToken, email, password} = req.body;

        if(!tempToken || !email || !password){
            return res.status(400).json({message: 'tempToken, email and password are required'})
        }

        //1. Find the walk-in using tempToken
        const person = await Person.findById(tempToken);
        if(!person || person.role !== 'walk-in'){
            return res.status(404).json({message: 'Invalid or expired session'})
        }

        const cleanEmail = email.toLowerCase().trim();

        //2. Check if email already exists on ANY other account
        const existingEmail = await Person.findOne({ 
            email: cleanEmail,
            _id: { $ne: person._id } // exclude current person
        });
        if (existingEmail){
            return res.status(400).json({message: 'Email already in use'})
        }

        //3. NEW: Check if phone already exists on another CUSTOMER
        // This stops 2 walk-ins with same number becoming customers
        const existingPhone = await Person.findOne({ 
            PhoneNumber: person.PhoneNumber,
            role: 'customer',
            _id: { $ne: person._id }
        });
        if (existingPhone){
            return res.status(400).json({message: 'This phone number is already registered to another customer'})
        }

        // 4. Hash Password + upgrade role
        const passwordHash = await bcrypt.hash(password, 10);
        person.email = cleanEmail;
        person.passwordHash = passwordHash;
        person.role = 'customer';

        //Clear any leftover OTP fields
        person.otpCode = undefined;
        person.otpExpires = undefined;

        await person.save();

        //5. Issue real login JWT 
        const token = jwt.sign(
            {id: person._id, role: person.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.status(201).json({
            message: 'Account created successfully',
            token,
            person: {
                id: person._id,
                FirstName: person.FirstName,
                LastName: person.LastName,
                email: person.email,
                role: person.role
            }
        });

    }catch (err){
        console.log(err);
        if (err.code === 11000){
            //Mongo duplicate key fallback
            return res.status(400).json({message: 'Email or Phone number already exists'})
        }
        res.status(500).json({message: 'Server error'});
    }
}

module.exports = { 
    getAllPersons,
    getMe,
    getClients,
    editPerson,
    deactivatePerson,
    reactivatePerson,
    upgradeToCustomer
};