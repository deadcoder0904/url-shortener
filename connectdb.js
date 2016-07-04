var mongoose = require('mongoose');
var mrl = process.env.MONGODB_URI || require('./private').MONGODB_URI;

mongoose.connect(mrl);
var db = mongoose.connection ;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('got db connection');
});

module.exports.db = db;
