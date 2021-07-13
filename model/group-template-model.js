const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupTemplateSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true
    },
    hidden:{ type: Boolean, default: false },
    datecreate: { type: Date, default: Date.now },
    dateedit: { type: Date }
})

groupTemplateSchema.statics = {
  async createGroupTemplate(data) {
    const groupTemplate = new this(data);
    try {
      await groupTemplate.save();
    } catch (err) {
      // logger.error("createTÏemplate error. " + err.message);
    }
    return groupTemplate;
  },
  async updateGroupTemplate(_id, update) {
    return await this.findByIdAndUpdate(_id, update)
  },
  async getListGroupTemplatePagination(start, limit, query) {
		query = query;
		start = parseInt(start);
		limit = parseInt(limit);
		const groupTemplate = await this.find(query).limit(limit).skip((start - 1) * limit + 1);
		const total = await this.countDocuments();
		return { groupTemplate, total };
	},
  async getListGroupTemplate() {
		const groupTemplate = await this.find({});
		return { groupTemplate, total };
	},
  async getGroupTemplateById(id) {
    const groupTemplate = await this.findById(id);
    return {groupTemplate}
  },
}

module.exports = mongoose.model('GroupTemplate', groupTemplateSchema, 'groupTemplate')
