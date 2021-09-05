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
  likes: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
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
      likes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      }],
      datecreate: {
        type: Date,
        default: Date.now
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
    const result = await this.findById(comment._id).populate('author', ['_id', 'name', 'picture']);
    return result
  },
  async repliesComment(_id, update) {
    return await this.findByIdAndUpdate(_id, update, {new : true}).populate('replies.author', ['_id', 'name', 'picture'])
  },
  async updateComment(_id, update) {
    return await this.findByIdAndUpdate(_id, update, {new : true})
  },
  async likeReplyComment(_id, commentId, update) {
    return await this.update({ _id: _id, "replies._id": commentId }, update, {new : true})
  },
  async getListComment(idStory) {
		const comments = await this.find({hidden: false, story: idStory})
      .populate('replies.author', ['_id', 'name', 'picture'])
      .populate('author', ['_id', 'name', 'picture'])
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