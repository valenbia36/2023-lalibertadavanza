const mongoose = require ('mongoose');

const NODE_ENV = process.env.NODE_ENV;
  
const dbConnect = async () =>{
try {
        const DB_URI = (NODE_ENV === 'test') ? await process.env.DB_URI_TEST : await process.env.DB_URI;
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnect;