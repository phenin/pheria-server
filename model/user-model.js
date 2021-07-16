const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    picture:{
        type: String,
        default: null
    },
    role: {
        type: String,
        default: null
    },
    hidden:{ type: Boolean, default: false },
    datecreate: { type: Date, default: Date.now },
    dateedit: { type: Date },
})

userSchema.statics = {
    async createUser(data) {
		const user = new this(data);
		try {
            console.log(user)
			await user.save();
		} catch (err) {
			// logger.error("createUser error. " + err.message);
		}
		return user;
	},
    async updateUser(_id, update) {
		return await this.findByIdAndUpdate(_id,update)
    },
    async getUserByEmail(email) {
		const query = { email: email };
		return this.findOne(query);
	},
    async getUserById(id) {
		return this.findById(id).select('-password');
	},
    async getUserByName(name) {
		const query = { name: name };
		return this.findOne(query);
	},
}

module.exports = mongoose.model('User', userSchema, 'user')
