import { useState } from "react";
import BookingForm from './BookingForm'
import  PaymentScreen from './PaymentScreen'
import AuthRedirect from './AuthRedirect'
import PaymentResult from './PaymentResult'
import './Booking.css'

export default function BookingFlow (){
    const [step,setStep] = useState('form') // form, payment,auth , success, failed

    const [bookingData, setBookingData] = useState(null)

    const goToPayment = (data) => {
        setBookingData(data)
        setStep('payment')
    }

    const goToAuth = () => setStep('auth')
    const goToResult = (status) => setStep(status) // 'success' or 'fail'


    if (step === 'form')
    return <BookingForm onSubmit={goToPayment} />

    if (step === 'payment')
        return (
            <PaymentScreen
                data={bookingData}
                onPay={goToAuth}
            />
        )

    if (step === 'auth')
        return (
            <AuthRedirect
                onResult={goToResult}
            />
        )

    return <PaymentResult status={step} />




}