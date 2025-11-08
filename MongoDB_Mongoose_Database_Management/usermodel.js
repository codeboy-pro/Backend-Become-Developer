const mongoose= require('mongoose');


mongoose.connect(`mongodb://127.0.0.1:27017/Pradip`);


const userschema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: String
});

module.exports = mongoose.model("user",userschema);









