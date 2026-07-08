const Person = require('../models/Person')


// @desc Get all customers + walk-ins
//@routes Get /api/people/clients
//@acesss Public

const getClients = async (req,res) => {
    try{
        const clients = await Person.find({
            role: {$in:['customer','walk-in']}
        })
        .select('FirstName LastName PhoneNumber email role isWalkIn createdAt')
        .sort({createdAt:-1});
        res.status(200).json(clients)
    }catch(error){
        res.status(500).json({message:'Servor Error',error:error.message})
    }
};
 module.exports ={
    getClients
 };