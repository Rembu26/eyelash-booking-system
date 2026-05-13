const Person = require('../models/Person');


exports.getMe = async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const person = await Person.findById(req.user.id).select('-passwordHash');
        
        if (!person) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        res.json({
            id: person._id,
            email: person.email,
            role: person.role,
            firstName: person.FirstName || '',   
            lastName: person.LastName || '',
            phoneNumber: person.PhoneNumber || '',
                consentForMarketing: person.ConsentForMarketing || false
        });


    } catch (error) {
        console.error('GetMe error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
}