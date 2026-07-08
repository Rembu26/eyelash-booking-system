const twilio = require('twilio');

const client =
twilio(process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN);

const FROM =
    process.env.TWILIO_WHATSAPP_NUMBER;

    const sendWhatsApp = async (phoneNumber,otp) => {
        try{
            await client.messages.create({
                from:FROM,
                to:phoneNumber,
                body:`Your upgrade Code: ${otp}\n\nThis code expires in 10 minutes.Don't share it with anyone.`
            });
            console.log(`Code sent to ${phoneNumber}`);
            return true;
        }catch(err){
            console.error("Twillio Erorr:",err.message);
            throw new Error('Failed to send WhatsApp Mesaage')
        }
    }

    module.exports = { sendWhatsApp }