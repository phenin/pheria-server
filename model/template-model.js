const mongoose = require('mongoose')
const Schema = mongoose.Schema

const templateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'GroupTemplate',
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
  image: {
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

templateSchema.statics = {
  async createTemplate(data) {
    const template = new this(data);
    try {
      await template.save();
    } catch (err) {
      // logger.error("createTÏemplate error. " + err.message);
    }
    return template;
  },
  async updateTemplate(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async getListTemplate(start, limit, query) {
		query = query || {} ;
		start = parseInt(start);
		limit = parseInt(limit);
		const template = await this.find({hidden: false}).limit(limit).skip((start - 1) * limit );
		const total = await this.countDocuments();
		return { template, total };
	},
  async getTemplateById(id) {
    const template = await this.findById(id);
    return {template}
  },
  async getListTemplateByGroup(group) {
    const template = await this.find({group})
    return template
  },
  async hiddenTemplate(_id) {
    return await this.findByIdAndUpdate(_id, {
      hidden: true 
    })
  },
}
module.exports = mongoose.model('Template', templateSchema, 'template')