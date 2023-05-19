require('dotenv').config();

const connectDB = require('./db/connect.js');
const Product = require('./models/product.js');
const productList = require('./products.json');

const connect = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const allProducts = await Product.find({});
    await Product.create(productList);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

connect();