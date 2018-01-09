const mongoose = require('mongoose');

var CarouselSchema = new mongoose.Schema({
    picture: Buffer,
    link: String,
    contentType: String,
    sort: Number
});

module.exports =  mongoose.model('Carousel', CarouselSchema);