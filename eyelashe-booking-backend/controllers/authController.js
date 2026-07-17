const Person = require('../models/Person');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');






exports.createWalkIn = async (req,res) => {
    try{
        const {FirstName,LastName,PhoneNumber} = req.body;

        if(!FirstName || !LastName|| !PhoneNumber){
            return res.status(400).json({message: 'FirstName,LastName,PhoneNumber are required'})
        }

        //checks if number already exists
        const existing = await Person.findOne({PhoneNumber});
        if(existing){
            return res.status(400).json({message:'This number already exists'})
        }

        const newWalkIn = new Person({
            FirstName,
            LastName,
            PhoneNumber,
            role:'walk-in',
            isWalkIn:true,
            status:'active'
        });
        await newWalkIn.save();
        res.status(201).json({message:'Walk-in customer created sucessfully',
            person:{
                id:newWalkIn._id,
                FirstName:newWalkIn.FirstName,
                 LastName:newWalkIn.LastName,
                  PhoneNumber:newWalkIn.PhoneNumber,
                  role:newWalkIn.role,
                  status: newWalkIn.status
            }
        });

    }catch(err){
        console.error(err);
        if(err.code === 11000){
            return res.status(400).json({message:'Phone number already exists'})
        }
        res.status(500).json({message:'Server error'})
    }
}


