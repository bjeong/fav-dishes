const mongoose = require('mongoose')

// Below is the schema for cats. 
// To make your own Schema, check the documentation Here:
// https://mongoosejs.com/docs/guide.html#definition
// You can also try a Schema Generator like this one:
// https://replit.com/@haroldsikkema/Schema-Generator-for-Mongoose
const schema = new mongoose.Schema({
  name: { type: 'String' },
  restaurant: { type: 'String' },
  location: { type: 'String' },
  description: { type: 'String' },
  fileName: { type: 'String' },
  cost: { type: 'Number' },
  vegan: { type: 'Boolean' }
})

module.exports = mongoose.model('Fav', schema);