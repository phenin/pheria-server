const mongoose = require('mongoose')
const Schema = mongoose.Schema

const backgroundSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  color: {
    type: String,
  },
  backgroundColor: {
    type: Array,
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

backgroundSchema.statics = {
  async createBackground(data) {
    const background = new this(data);
    try {
      await background.save();
    } catch (err) {
    }
    return background;
  },
  async updateBackground(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async getListBackground(start, limit, query) {
		query = query || {} ;
		start = parseInt(start);
		limit = parseInt(limit);
		const background = await this.find({hidden: false}).limit(limit).skip((start - 1) * limit );
		const total = await this.countDocuments();
		return { background, total };
	},
  async getBackgroundById(id) {
    const background = await this.findById(id);
    return background
  },
  async getBackgroundDefault() {
    const background = await this.findOne({backgroundColor: { "$in" : ["#000000"]} , color: '#ffffff'});
    return background._id
  },
  async hiddenBackground(_id) {
    return await this.findByIdAndUpdate(_id, {
      hidden: true 
    })
  },
}
module.exports = mongoose.model('Background', backgroundSchema, 'background')