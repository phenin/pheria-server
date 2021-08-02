const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Status = Object.freeze({
  Sexual: 'sexual',
  Prohibited: 'prohibited'
})

const storySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  background: {
    type: Schema.Types.ObjectId,
    ref: 'Background',
    required: true
  },
  contents: [
    {
      text: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      uuid: {
        type: String,
        required: true
      }
    }
  ],
  templates: [
    {
      template: {
        type: Schema.Types.ObjectId,
        ref: 'Template',
        required: true
      },
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      uuid: {
        type: String,
        required: true
      }
    }
  ],
  image: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  hearts: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  views: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  comments: [
    {
      user: {
        type: Schema.ObjectId, 
        ref: 'User'
      },
      content: {
        type: String,
      }
    }
  ],
  status: {
    type: String,
    enum: Object.values(Status),
  },
  swearwords: {
    type: Array,
  },
  music: {
    type: String,
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
  async getListStory(start, limit, query) {
		query = query || {} ;
		start = parseInt(start);
		limit = parseInt(limit);
		const story = await this.find(query).limit(limit).skip((start - 1) * limit );
		const total = await this.countDocuments();
		return { story, total };
	},
  async getStoryById(id) {
    const story = await this.findById(id).populate('template');
    return story;
  },
}

module.exports = mongoose.model('Story', storySchema, 'story')