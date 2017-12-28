const mongoose = require('mongoose');

var CarouselSchema = new mongoose.Schema({
    picture: Object,
    link: String,
    sort: Number
});

module.exports =  mongoose.model('Carousel', CarouselSchema);