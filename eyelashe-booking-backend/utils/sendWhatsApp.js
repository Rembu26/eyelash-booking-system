const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = process.env.TWILIO_WHATSAPP_NUMBER; // must be: whatsapp:+14155238886

const sendWhatsApp = async (phoneNumber, otp) => {
    try {
        // 1. Clean the number: remove spaces, +, etc
        let phone = phoneNumber.replace(/\D/g, ''); // 0715551234 -> 0715551234
        
        // 2. Convert SA numbers to international format
        if (phone.startsWith('0')) {
            phone = '27' + phone.slice(1); // 0715551234 -> 27715551234
        }
        if (phone.startsWith('27') === false && phone.length === 10) {
            phone = '27' + phone; // safety net
        }

        console.log(`Sending WhatsApp to: whatsapp:+${phone}`);

        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER, // must include whatsapp: prefix in .env
            to: `whatsapp:+${phone}`, // must include whatsapp: prefix
            body: `Your upgrade Code: ${otp}\n\nThis code expires in 10 minutes. Don't share it with anyone.`
        });
        
        console.log(`WhatsApp sent to whatsapp:+${phone}`);
        return true;
    } catch (err) {
        console.error("Twilio Error:", err.message, err.code);
        throw new Error(`Failed to send WhatsApp Message: ${err.message}`);
    }
}

module.exports = { sendWhatsApp }