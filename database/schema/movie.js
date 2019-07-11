const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
    doubanId: {
        type: String,
        unique: true
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
    rate: Number,
    title: String,
    summary: String,
    video: String,
    videoKey: String,
    poster: String,
    posterKey: String,
    cover: String,
    coverKey: String,
    pubdate: Mixed,
    year: Number,
    genre: [String]
}, {
    versionKey: false,
    timestamps: true
})

mongoose.model('Movie', movieSchema)