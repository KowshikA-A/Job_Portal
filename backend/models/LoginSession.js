const mongoose = require('mongoose');

const loginSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    loginTime: { type: String, required: true },
    token: { type: String, required: true }
});

module.exports = mongoose.model('LoginSession', loginSessionSchema);