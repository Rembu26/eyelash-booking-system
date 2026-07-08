const Person = require('../models/Person');
const { sendWhatsApp } = require('../utils/sendWhatsApp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.sendOtp = async (req,res) => {
    try{
        const { PhoneNumber } = req.body; // 1. get it from body
        if(!PhoneNumber) return res.status(400).json({message: 'PhoneNumber required'})

        const person = await Person.findOne({PhoneNumber, role: 'walk-in'}); // 2. find person
        if(!person) return res.status(404).json({message: 'Walk-in not found'})

        const code = Math.floor(100000 + Math.random()* 900000).toString();
        person.otpCode = code;
        person.otpExpires = new Date(Date.now()+ 5 * 60 * 1000)
        await person.save();

        console.log(`OTP for ${PhoneNumber}: ${code}`);
        // await sendWhatsApp(PhoneNumber, `Your SalonHub code: ${code}`);

        res.json({ message: 'Code sent via WhatsApp' });
    }catch(err){
         console.error(err);
         res.status(500).json({ message: 'Server error' });
    }
}

exports.verifyOtp = async (req,res) => {
    try{
        const {PhoneNumber,code} = req.body;

        if(!PhoneNumber || !code){
            return res.status(400).json({message: 'Phone Number and code are required'})
        }

        const person = await 
        Person.findOne({PhoneNumber,role:'walk-in'});

        if(!person){
            return res.status(404).json({message:'Person not found'})
        }

        //1. Check if the OTP EXISTS
        if(!person.otpCode || !person.otpExpires){
            return res.status(400).json({ message: 'No code requested.Pease send OTP First.'})
        }

        // 2.Check Expiry
        if(person.otpExpires < new Date()){
            person.otpCode = undefined; // clear expired code

            person.otpCode = undefined;
            await person.save();
            return res.status(400).json({message: 'Code Expired . Request a new one'})
        }

        //3.Check match
        if(person.otpCode !=code){
            return res.status(400).json({message: 'Invalid code'})
        }

        //4. Code is valid -> clear it and return a temp token
        //We don't update fro "walk-in" to "customer" role just yet. That happens pm/upgrade with email + password
         person.otpCode = undefined;
        person.otpExpires = undefined;
        await person.save();

    // TODO: sign a short-lived JWT here so frontend can call /upgrade
    // const token = jwt.sign({ id: person._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const tempToken = person._id.toString(); // <-- replace with real JWT later

    res.json({ 
      message: 'Code verified', 
      tempToken, // use this for the /upgrade call
      person: { id: person._id, FirstName: person.FirstName, LastName: person.LastName }
    });
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: 'Server Error'})
    }
}


exports.upgradeToCustomer =async (req,res) =>{
    try{
        const {tempToken,email,password} = req.body;

        if(!tempToken || !email || !password){
            return res.status(400).json({message: 'tempToken,email and password are required'})
        }

        //1. Fins the using the tempToken. For now =_id . Late = verify JWT
        const person = await 
        Person.findById(tempToken);
        if(!person || person.role !== 'walk-in'){
            return res.status(404).json({message: 'Invalid or expired session'})
        }

        //2.Check email not token
        const existing = await 
        Person.findOne({email:
            email.toLowerCase().trim() });
            if (existing){
                return res.status(400).json({message: 'Email already in use'})
            }

        // 3. Hash Pashword + updgrade role
        const passwordHash = await 
        bcrypt.hash(password,10);
        person.email = 
        email.toLowerCase().trim();
        person.passwordHash = passwordHash;
        person.role = 'customer';

        //Clear any leftover OTP fields just in case
        person.otpCode = undefined;
        person.otpExpires = undefined;

        await person.save();

        //4. Issue real login JWT 
        const token = jwt.sign(
            {id: person._id, role:person.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.status(201).json({
            message:'Account created successfully',
            token,
            person:{
                id: person._id,
                FirstName:person.FirstName,
                LastName:person.LastName,
                email:person.email,
                role:person.role
            }
        });

    }catch (err){
        console.log(err);
        if (err.code ===11000){
            //Mongo duplicate key
            return res.status(400).json({message: 'Email or Phone number already exists'})
        }
        res.status(500).json({message: 'Server error'});
    }
}

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

exports.sendUpgradeOTP = async(req,res) =>{
    try{
        const client = await Person.findById(req.params.id);
        if(!client) return res.status(404).json({message: 'Client not found'});
        if(client.role !== 'walk-in') return res.status(400).json({message: 'Only walk-ins can be upgraded'});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        client.otpCode = otp;
        client.otpExpires = Date.now() + 10 * 60 * 1000;
        await client.save();

        await sendWhatsApp(client.PhoneNumber, otp);

        res.json({ message: 'OTP sent to WhatsApp' });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

