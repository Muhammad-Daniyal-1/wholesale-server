const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const slugify = require("slugify");

// get all products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 15; // Number of items per page
  const startIndex = (page - 1) * limit;
  // const products = await Product.find({}).populate("category").populate("subcategory").select('-price').skip(startIndex).limit(limit);
  const products = await Product.find({}).populate("category").populate("subcategory").select('-price');
  res.json(products);
});

const getProductsforAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 15; // Number of items per page
  const startIndex = (page - 1) * limit;  
  const productsfind = await Product.find({}).populate("category");
  const products = productsfind.reverse();
  res.json(products);
});

const getProductsWithToken = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const startIndex = (page - 1) * limit;
  const user = req.user.id;
  // const products = await Product.find({}).populate("category").populate("subcategory").populate('tags').skip(startIndex).limit(limit);
  const products = await Product.find({}).populate("category").populate("subcategory").populate('tags');
  const userType = await User.findById(user).populate("tier");

  if (userType.type === "Retailer" || userType.type === "Dropshipper") {
    const productsByTier = products.map((product) => {
      const { price, tags } = product;
      let tagValue = 1; // Default tag value if tags property doesn't exist
      if (tags) {
        tagValue = userType.type === "Retailer" ? tags.retailerValue : tags.dropshipperValue;
      }
      let tierPercentage = userType.tier ? userType.tier.percentage : 0;
      let tagPrice = (price / tagValue);
      let tierPrice = tagPrice - (tagPrice * tierPercentage) / 100;
      product.price = tierPrice.toFixed(2);
      return product;
    });
    res.json(productsByTier);
  }
});

// get product by id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// create product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    subcategory,
    skuNumber,
    price,
    stock,
    reference,
    condition,
    specificReferences,
    description,
    variation,
    metalType,
    tags,
    styleCode,
    barCode,
    metalColor,
    rhodiumPlayed,
    chainLength,
    chainType,
    clasp,
    ringSize,
    pheight,
    pwidth,
    plength,
    backing,
    minCartTotalWeight,
    averageColor,
    averageClarity,
    settingType,
    numberofDiamonds

  } = req.body;

  const images = [];
  const url = req.protocol + "s://" + req.get("host");
  if (req.files !== undefined) {
    for (var i = 0; i < req.files.length; i++) {
      images.push(url + "/uploads/images/" + req.files[i].filename);
    }
  } else {
    images.push(url + "/uploads/images/placeholder.png");
  }

  // const user = req.user.id;
  let slug = slugify(name, {
    lower: true,
  });
  slug = slug + "-" + reference;
  const productCat = await Category.findById(category);

  let sub = null;

  if(subcategory !== 'null' ){
    sub = subcategory;
  }

  const product = new Product({
    name,
    slug,
    category,
    subcategory: sub,
    skuNumber,
    price,
    stock,
    reference,
    condition,
    specificReferences,
    description,
    variation,
    metalType,
    tags,
    styleCode,
    barCode,
    metalColor,
    rhodiumPlayed,
    chainLength,
    chainType,
    clasp,
    ringSize,
    pheight,
    pwidth,
    plength,
    backing,
    minCartTotalWeight,
    averageColor,
    averageClarity,
    settingType,
    numberofDiamonds,
    images
  });

  const savedProduct = await product.save();

  const saved = await savedProduct.populate("category");
  res.status(201).json(saved);
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    subcategory,
    description,
    skuNumber,
    price,
    stock,
    specificReferences,
    condition,
    reference,
    variation,
    metalType,
    tags,
    styleCode,
    barCode,
    metalColor,
    rhodiumPlayed,
    chainLength,
    chainType,
    clasp,
    ringSize,
    pheight,
    pwidth,
    plength,
    backing,
    minCartTotalWeight,
    averageColor,
    averageClarity,
    settingType,
    numberofDiamonds
  } = req.body;

  const images = [];
  const url = req.protocol + "s://" + req.get("host");
  if (req.files !== undefined) {
    for (var i = 0; i < req.files.length; i++) {
      images.push(url + "/uploads/images/" + req.files[i].filename);
    }
  }
  let slug = slugify(name, {
    lower: true,
  });
  slug = slug + "-" + reference;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.slug = slug;
    product.category = category;
    product.description = description;
    product.skuNumber = skuNumber;
    product.price = price;
    product.stock = stock;
    product.specificReferences = specificReferences;
    product.condition = condition;
    product.reference = reference
    product.styleCode = styleCode;
    product.barCode = barCode;
    product.metalColor = metalColor;
    product.rhodiumPlayed = rhodiumPlayed;
    product.chainLength = chainLength;
    product.chainType = chainType;
    product.clasp = clasp;
    product.ringSize = ringSize;
    product.pheight = pheight;
    product.pwidth = pwidth;
    product.plength = plength;
    product.backing = backing;
    product.minCartTotalWeight = minCartTotalWeight;
    product.averageColor = averageColor;
    product.averageClarity = averageClarity;
    product.settingType = settingType;
    product.numberofDiamonds = numberofDiamonds;

    if (tags !== "undefined"){
      product.tags = tags;
    }

    if(metalType !== undefined){
      product.metalType = metalType;
    }
   
    if (images.length > 0) {
      product.images = images;
    }

    if (subcategory !== "null") {
      product.subcategory = subcategory;
    }

    if (variation?.length > 0) {
      product.variation = variation;
    }

    const saveupdated = await product.save();
    const updatedProduct = await saveupdated.populate("category");
    res.json({
      message: "Product updated successfully",
      type: "success",
      updatedProduct
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed successfully", type: "success" });
  } else {
    res.json({ message: "Product not found", type: "warning" });
  }
});

// get products by user
const getProductsByUser = asyncHandler(async (req, res) => {
  const pageNo = parseInt(req.query.pageNo) || 1;
  const size = parseInt(req.query.pageSize) || 10;
  const query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  const products = await Product.find({ user: req.params.user }, {}, query);
  if (products) {
    res.json(products);
  } else {
    res.json({ message: "No products found for this user", type: "warning" });
  }
});


const updateproductimageurl = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  if (products) {
    products.forEach(async (product) => {
      const images = product.images;
      const updatedImages = [];
      images.forEach((image) => {
        const updatedImage = image.replace("httpss", "https");
        updatedImages.push(updatedImage);
      });
      product.images = updatedImages;
      await product.save();
    });
    res.json({ message: "Product images updated successfully", type: "success" });
  } else {
    res.json({ message: "No products found", type: "warning" });
  }
});


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUser,
  getProductsWithToken,
  getProductsforAdmin,
  updateproductimageurl
};
