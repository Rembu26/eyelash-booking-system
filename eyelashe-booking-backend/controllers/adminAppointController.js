import { Import } from "lucide-react";
import Appointment from "../models/Appointment.js";
import Person from "../models/Person.js";
import {authMiddleware,requireRole} from '../middleware/authMiddleware.js'

export const getAdminAppointments =  async (req,res) => {
    try{
        const {status,date,customer,staffId} = req.query;
        let filter ={};

        if (status) filter.status=status;
        if (staffId) filter.staff = staffId;
        if (date) {
            const start = new Date(date);
            const end = new Date (date);

            end.setDate(end.getDate() + 1);
            filter.date = {$gte: start, $lt:end};
        }
        if (customer) {
            //search by customer First + Last Name

            const person = await Person.find({
                $or:[
                    {FirstName: {$regex : customer,$options: 'i'} },
                    {LastName: {$regex : customer,$options: 'i'} }
                ] 
            }) .select('_id');
            filter.customer = { $in:
                person.map(u => u._id)
            };
        }
        const appointments = await 
        Appointment.find(filter)
        .populate('customer','FirstName LastName email PhoneNumber')
        .populate('staff','FirstName LastName')
        .populate('service','name price duration')
        .sort({date: -1});

        res.json(appointments)
    }
    catch(err){
        res.status(500).json({message : err.message});
    }
};

export const cancelAdminAppointment = async (req,res) =>{
    try{
        const appointment = await 
        Appointment.findById(req.params.id);

        if(!appointment)
            return res.status(404).json({message : 'Not Found'})

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({message:'Appointment cancelled'});
    }catch(err){
        res.status(500).json({ message : err.message})
    }
};