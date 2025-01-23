"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRaffleSeed = generateRaffleSeed;
exports.generateRaffleTimeline = generateRaffleTimeline;
const crypto_1 = require("crypto");
function generateRaffleSeed(signups) {
    // Sort signups by registrationIntent to ensure consistent ordering
    const sortedSignups = [...signups].sort((a, b) => a.registrationIntent.getTime() - b.registrationIntent.getTime());
    // Create the combined string of email+timestamp
    const combinedString = sortedSignups
        .map(signup => `${signup.email}${signup.registrationIntent.getTime()}`)
        .join('');
    // Generate SHA-256 hash
    return (0, crypto_1.createHash)('sha256')
        .update(combinedString)
        .digest('hex');
}
function generateRaffleTimeline(startTime) {
    return {
        registrationStart: startTime,
        registrationEnd: new Date(startTime.getTime() + 30000), // 30 seconds for registration
        simulationStart: new Date(startTime.getTime() + 31000), // Start simulation after registration
        simulationEnd: new Date(startTime.getTime() + 46000) // 15 seconds for simulation
    };
}
