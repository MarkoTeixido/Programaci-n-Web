const { json } = require('body-parser');
const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    geo: {
        type: Object,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Tareas', TaskSchema);