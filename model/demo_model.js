const mongoose = require('mongoose');

const demoAPISchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});
const demo_api = mongoose.model('demo_api_list', demoAPISchema); // demo_api_list = Collection name

module.exports = demo_api;