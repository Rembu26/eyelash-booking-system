// getPublicIP.js
const fetch = require("node-fetch"); // npm install node-fetch@2

async function getPublicIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        console.log("Your current public IP is:", data.ip);
        return data.ip;
    } catch (err) {
        console.error("Error fetching IP:", err);
    }
}

getPublicIP();