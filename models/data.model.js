const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('data', dataSchema)
