var mongoose = require("mongoose");

var UrlSchema = new mongoose.Schema({
	id:{
		type: Number,
		required: true
	},
    original_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Url',UrlSchema);