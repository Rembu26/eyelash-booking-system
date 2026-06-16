import React, { useState } from "react";
import {toast} from "react-toastify";
import './Staff.css'

export default function AddService({onAdded,onClose}){
    const [form,setForm] = 
    useState({name: '', price: '',duration:''})

    const token = 
    localStorage.getItem('token')

    const handleSubmit = async (e) => {
        e.preventDefault()
        //Validation 
        if(!form.name.trim()){
            toast.error('Service Name is required')
             return
        }
        
        if(Number(form.price) <=0){
             
        toast.error('Price must be greater than 0')
        return
        }
        if(Number(form.duration) <5) 
            {
                toast.error('Duration must be at least 5 minutes')
                return
            }
        

        try{
            const res = await fetch("http://localhost:3000/api/services/", {
            method: 'POST',
            headers: {'Content-Type':
                'application/json',Authorization:
                `Bearer ${token}`
            },
                body : JSON.stringify(form)
            })
            if(!res.ok){
                const err = await res.json()
                toast.error(err.error || 'Failed to submit')
                return
            }
            toast.success('Service submitted for admin approval! 🎉')
            onAdded()
            onClose()
        }catch(err){
            toast.error('Failed to submit.Try again.')
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose}>X</button>
                <form onSubmit={handleSubmit} className="service-form">
                <input placeholder="Service Name" value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} />
                <input type="number" placeholder="Price R" min="1" step="0.01" value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} />
                <input type="number" placeholder="Duration in mins" min="5" step="5" value={form.duration} 
                onChange={e => setForm({...form, duration: e.target.value})} />
                <button className="submit-btn">Submit for Approval</button>
                </form>
            </div>
        </div>



       
    )


}



