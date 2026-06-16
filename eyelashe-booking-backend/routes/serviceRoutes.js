// server/routes/serviceRoutes.js
const express = require('express')
const Service = require('../models/Service')
const authMiddleware = require('../middleware/authMiddleware')
const { Server } = require('lucide-react')
const router = express.Router()

//GER/api/service/my-staff only
router.get('/my',authMiddleware, async(req,res) =>{
    try{
        


        if(req.user.role !== 'staff') {return
    res.status(403).json({error: "Access denied, Staff can only access!"})
}


    const services = await 
    Service.find({createdBy:req.user.id})
    res.json(services)

    }
    catch(err){
        res.status(500).json({err:error.message})
    }
})



router.get('/', async (req,res) =>{
    const services = await 
    Services.find({approved: true, active:true})
    res.json(services)
})



// POST /api/services - Stylist creates
router.post('/', authMiddleware, async (req,res) => {
  try {
    if(req.user.role !== 'staff') {
      return res.status(403).json({error: "Staff only"})
    } 

    const service = await Service.create({
      ...req.body,
      createdBy: req.user.id,
      stylistIds: [req.user.id],
      approved: false
    })

    console.log('Created services:',service._id)
    
    res.status(201).json(service)
  } catch(err) {
    console.log('Create error:', err.message)
    res.status(500).json({error: err.message})
  }
})



//GET/API/SERVICES/PENDING  → admin dashboard
router.get ('/pending', authMiddleware, async (req,res) =>{
    if (req.user!== 'admin')
        return res.status(403)

    const pending = await 
    Service.find ({approved:false}). populate('createdBy', 'FirstName LastName')
    res.json(pending)
})

//PATCH/api/services/:id/approve
router.patch('/:id/approve',authMiddleware,async (req,res) =>{
   try{
     if(req.user.role!== 'admin')
        return res.status(403).json({ error :'Admin only'})


    const {stylistIds} = 
    req.body // admin can only assign other

    const service = await
    Service.findByIdAndUpdate(
        req.params.id,
        { approved:true,approvedBy: req.user.id,stylistIds,active:true},
       
        { new:true}
    )
    if(!service)
        return res.status(404).json({error: "Service not found"})
    res.json(service)
   }catch(err){
    res.status(500).json({error:err.message})
   }
})

//PATCH/ api/services/:id/deactivate - ADMIN "rejects"
router.patch('/:id/deactivate',authMiddleware,async (req,res) =>{
    try{
        if(req.user.role!== 'admin'){
            return
            res.status(403).json({error: "Admin only"})
        }

       const service = await
       Service.findByIdAndUpdate(
        req.params.id,
        {active: false},
        {new:true}
       )
       res.json(service)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

//PATCH/api/services/:id/active - Bring back
router.patch(':id/activate',authMiddleware,async (req,res)=>{
    try{
        
        if(req.user.role!== 'admin'){
            return
            res.status(403).json({error: "Admin only"})
        }
        const service = await
       Service.findByIdAndUpdate(
        req.params.id,
        {active: true},
        {new:true}
       )
       res.json(service)
    }catch(err){
        res.status(500).json({error:err.message})
    }

    
})

//GET/api/services/admin - Admin Filter route
router.get('/admin',authMiddleware, async(req,res) =>{
    try{
        if (req.user.role!=='admin'){
            return res.status(403).json({error:'Admin Only'})
        }

        const filter = 
        JSON.parse(req.query.filter ||'{}')
        const services = await 
        Service.find(filter).populate('createdBy','FirstName LastName').sort({createdAt:-1})
        
    
        res.json(services)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})



module.exports = router