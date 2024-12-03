const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: { type: String },
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
