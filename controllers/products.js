const Product = require('../models/product.js');

const getAllProductsStatic = async (req, res) => {
  let products = await Product.find({ company: 'caressa', price: { '$gt': 80 } })
    .sort('price')
    .select('name price')
  res.status(200).json({ data: products });
}

const getAllProducts = async (req, res) => {
  let { company, featured, name, sort, fields, numericFilters } = req.query;

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  if (numericFilters) {
    const regex = /\b(>|>=|=|<|<=)\b/g;
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte'
    }

    let filters = numericFilters.replace(regex, (match) => {
      return `-${operatorMap[match]}-`;
    });

    const options = ['price', 'rating'];

    filters.split(',').forEach(item => {
      const [filter, operator, value] = item.split('-');
      if (options.includes(filter)) {
        queryObject[filter] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.replaceAll(',', ' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('-cretedAt');
  }

  if (fields) {
    const fieldsList = fields.replaceAll(',', ' ');
    result = result.select(fieldsList);
  } else {
    result = result.select('-_id -__v');
  }

  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  let skip = (page - 1) * limit;

  result.skip(skip);
  result.limit(limit);

  const products = await result;
  res.status(200).json({ nHits: products.length, products });
}

const addOneProduct = async (req, res) => {
  // throw new Error('testing async error');
  const { name, price, company } = req.body;
  const product = await Product.create({ name, price, company });
  res.status(201).json({ product: product });
}

module.exports = { getAllProducts, addOneProduct, getAllProductsStatic }