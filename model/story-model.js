const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Status = Object.freeze({
  Sexual: 'Sexual',
  Prohibited: 'prohibited'
})

const storySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  heart: {
    type: String,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(Status),
  },
  hidden: {
    type: Boolean,
    default: false
  },
  datecreate: {
    type: Date,
    default: Date.now
  },
  dateedit: {
    type: Date
  }
})

Object.assign(storySchema.statics, {
  Status,
})

storySchema.statics = {
  async createStory(data) {
    const story = new this(data);
    try {
      await story.save();
    } catch (err) {
      // logger.error("createUser error. " + err.message);
    }
    return story;
  },
  async updateStory(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async getStoryById(id) {
    return this.findById(id).select('-password');
  },
}

module.exports = mongoose.model('Story', storySchema, 'story')