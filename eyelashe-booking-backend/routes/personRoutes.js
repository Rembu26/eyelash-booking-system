// Import the Express framework
const express = require('express');

// Import the Person model from the models folder
const Person = require('../models/Person');

// Create an Express router object
const router = express.Router();


// =======================================================
// GET /api/persons?role=stylist
// Returns all persons, or only persons with a specific role
// Example:
// GET /api/persons          -> Returns all persons
// GET /api/persons?role=stylist -> Returns only stylists
// =======================================================
router.get('/', async (req, res) => {
    try {
        // Extract the role query parameter from the URL
        const { role } = req.query;

        // If a role is provided, create a filter object
        // Otherwise return all records
        const filter = role ? { role } : {};

        // Find matching persons in the database
        // Select only the name and avatar fields
        // Exclude the default MongoDB _id field
        const persons = await Person
            .find(filter)
            .select('FirstName LastName -_id avatar').lean()

            //Add Full name field for front end
            const withFullName = persons.map(p =>({
                ...p,
                fullName: `${p.FirstName} ${p.LastName}`
            }))


        // Send the list of persons back as JSON
        res.json(withFullName);

    } catch (err) {

        // If an error occurs, return a 500 status code
        res.status(500).json({
            error: err.message
        });
    }
});


// =======================================================
// GET /api/persons/me
// Returns information about the currently logged-in user
// Used for displaying user details in ClientInfoCard
// =======================================================
router.get('/me', async (req, res) => {
    try{
// req.user is populated by the authentication middleware
    // It contains information about the logged-in user

    const user = await Person
        .findById(req.user.id)
        .select('FirstName LastName email role avatar');

    // Return the user's information as JSON
    res. json({
        ...user.toObject(),
        fullName:`${user.FirstName} ${user.LastName}`
    });
    }
    catch(err){
        res.status(500).json({error:
            err.message
        })
    }

   
});


// Export the router so it can be used in server.js/app.js
module.exports = router;