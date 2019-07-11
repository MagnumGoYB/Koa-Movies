const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }]
}, {
    versionKey: false,
    timestamps: true
})

mongoose.model('Category', categorySchema)