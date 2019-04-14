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
    movieTypes: [String],
    tags: Array,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Movie', movieSchema)