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
  async getListComment(idStory, query) {
    const comments = await this.aggregate([
      { $match: { hidden: false, story: idStory } },
      { $skip: Number.parseInt(query.offset) },
      { $limit: Number.parseInt(query.limit) },
      { $project: {
          author: 1,
          content: 1,
          likes: 1,
          repliesCount: { "$size": "$replies" },
          datecreate: 1
        }
      },
      { $lookup: { from: 'user',localField: 'author',foreignField: '_id', as: "author"} }
    ])
    const total = await this.countDocuments();
    const commentConvert = comments.map((item)=>{
      const author = {
        picture: item.author[0].picture,
        name: item.author[0].name,
        _id: item.author[0]._id
      }
      return {
        _id: item._id,
        likes: item.likes,
        content: item.content,
        author: author,
        datecreate: item.datecreate,
        repliesCount: item.repliesCount
      }
    })

		return { comments: commentConvert, total };
	},
  async showRepliesComment(_id, query) {
    return await this.findOne({_id}, {replies: {$slice:[Number.parseInt(query.offset), Number.parseInt(query.limit)]}} )
      .select({ story: 0,hidden: 0, likes: 0, content: 0, author: 0, datecreate: 0 })
      .populate('replies.author', ['_id', 'name', 'picture'])
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