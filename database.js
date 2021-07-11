const mongoose = require('mongoose');
const DBNAME = {
    vt: "vt"
}

const connectDB = (config_url) => {
    return new Promise (function (resolve, reject) {

        if (!config_url) {
            return reject(new Error('Missing MongoDB configuration!'));
        }

        try {
            // const options = { server: { socketOptions: { connectTimeoutMS: 10000 }}};

            console.log('Trying to connect DB...', config_url,);
            mongoose.connect(config_url, { useNewUrlParser: true }, 
                function(err, client) {
                    if (err) {
                        console.log("db helper error", err);
                        return reject(err);
                    }

                    resolve(client);
                }
            )
            
        } catch (e) {
            console.log('catch e', e);
        }
    });
}

const init = (db_names) => {
    var c1 = new Promise((resolve, reject) => {
        const uri = "mongodb+srv://phenin:12345654321@vt.x3ajk.mongodb.net/pheria?retryWrites=true&w=majority";
        connectDB(uri).then((client) => {
            resolve()
        }).catch((e) => {
            console.log('connectDB error', e)
            reject(e)
        });
    })     
    
    return Promise.all([c1]).then(() => {
        console.log('-- db ready --')
    });
}

module.exports = {
    init,
    connectDB
}
