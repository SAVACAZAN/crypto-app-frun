// schemas/faucetData.js
const mongoose = require('mongoose');

// Definim schema pentru datele faucetului
const faucetDataSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  faucetBalance: {
    type: Number, // Corectăm tipul la Number
    default: 0,
  },
});

// Creăm un model pentru datele faucetului folosind schema definită
const FaucetData = mongoose.model('FaucetData1', faucetDataSchema);

module.exports = FaucetData;
