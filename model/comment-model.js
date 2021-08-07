const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  story: { 
    type: Schema.Types.ObjectId, 
    ref: 'Story',
    index: true
  },
  content: {
    type: String,
    required: true
  },
  replies: [ 
    {
      author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true
      },
      content: {
        type: String,
        required: true
      },
    } 
  ],
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

commentSchema.statics = {
  async createComment(data) {
    const comment = new this(data);
    try {
      await comment.save();
    } catch (err) {
    }
    return comment;
  },
  async repliesComment(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async updateComment(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async getListComment(idStory) {
		const comments = await this.find({hidden: false, story: idStory})
      .populate('replies.author', ['name', 'picture'])
      .populate('author', ['name', 'picture']);
		return { comments };
	},
  async getCommentById(id) {
    const comment = await this.findById(id);
    return comment
  },
  async hiddenComment(_id) {
    return await this.findByIdAndUpdate(_id, {
      hidden: true 
    })
  },
}
module.exports = mongoose.model('Comment', commentSchema, 'comment')