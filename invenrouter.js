const express = require('express');
const Papa = require('papaparse');
const addCategory = require('./models/Category');
const addSubCategory = require('./models/SubCategory');
const Product = require('./models/Product');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
// const upload = require('./middleware/fileUpload')
const router = express.Router();
const slugify = require('slugify');
const csvFilePath = 'wholesale.csv';
const csvFile = require('fs').readFileSync(csvFilePath, 'utf8');

const upload = multer({ dest: 'uploads/images/' });


var jsonData = Papa.parse(csvFile, {
    header: true,
    dynamicTyping: true,
}).data;

jsonData = jsonData.map((item) => {
    remove = ['Product ID'];
    const price = item['Price (tax excl.)'];
    return {
        ...item,
        'id': Number(item['Product ID']),
        'Price': Number(price),

    };
});


router.post('/', upload.single('csvFile'), async (req, res) => {
    try {
        const categoryMap = new Map(); // Map to track category names and IDs

        for (const row of jsonData) {
            const { id, Image, Name, Reference, Price, Quantity, Status, Category } = row;

            let categoryId;
            let subcategoryId; // Variable to store the subcategory ID

            if (!categoryMap.has(Category)) {
                let categoryName = 'Uncategorized';
                let subcategoryName = null;

                if (Category && Category.includes(' ')) {
                    [subcategoryName, categoryName] = Category.split(' ');
                } else {
                    categoryName = Category;
                }

                const categorySlug = categoryName !== null ? slugify(categoryName, {
                    lower: true,
                    remove: /[*+~.()'"!:@]/g,
                }): 'uncategorized';

                const subcategorySlug = subcategoryName !== null
                    ? slugify(subcategoryName, {
                        lower: true,
                        remove: /[*+~.()'"!:@]/g,
                    })
                    : null;

                const existingCategory = await addCategory.findOne({ name: categoryName }).exec();
                if (existingCategory) {
                    categoryId = existingCategory._id;
                } else {
                    const category = new addCategory({
                        name: categoryName,
                        slug: categorySlug,
                    });
                    await category.save();
                    categoryId = category._id;
                }

                if (subcategoryName && subcategorySlug) {
                    const existingSubcategory = await addSubCategory.findOne({ name: subcategoryName }).exec();
                    if (existingSubcategory) {
                        subcategoryId = existingSubcategory._id;
                    } else {
                        const subcategory = new addSubCategory({
                            name: subcategoryName,
                            slug: subcategorySlug,
                            category: categoryId,
                        });
                        await subcategory.save();
                        subcategoryId = subcategory._id;
                    }
                }

                categoryMap.set(Category, { categoryId, subcategoryId }); // Add new category and subcategory to the map
            } else {
                const categoryData = categoryMap.get(Category); // Get existing category and subcategory IDs from the map
                categoryId = categoryData.categoryId;
                subcategoryId = categoryData.subcategoryId;
            }

            let imageFilename = `${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
            let imagePath;

            // Download image from the URL
            if (Image) {
                try {
                    imagePath = `uploads/images/${imageFilename}`;
                    const imageResponse = await axios.get(Image, { responseType: 'stream', timeout: 50000 });
                    imageResponse.data.pipe(fs.createWriteStream(imagePath));
                } catch (error) {
                    console.error('Error downloading image:', error);
                    // Use the placeholder image URL as a fallback
                    imagePath = 'uploads/images/empty.png';
                    const placeholderImageResponse = await axios.get('https://wholesale-client.vercel.app/assets/img/empty.png', { responseType: 'stream', timeout: 50000 });
                    placeholderImageResponse.data.pipe(fs.createWriteStream(imagePath));
                }
            } else {
                imagePath = 'uploads/images/empty.png';
            }

            // Construct the complete image URL
            const url = req.protocol + '://' + req.get('host') + '/';
            const imageFullUrl = url + imagePath;

            // Insert product into the database
            let visibility = Status === 1 ? true : false;
            const productName = String(Name);
            let slug = slugify(productName, {
                lower: true,
            });
            slug = slug + '-' + Reference;
            if (Name !== undefined || Reference !== undefined || Price !== NaN || Quantity !== undefined || Status !== undefined || imageFullUrl !== undefined || categoryId !== undefined) {
                const product = new Product({
                    name: Name,
                    slug: slug,
                    reference: Reference,
                    skuNumber: Reference,
                    price: Price,
                    stock: Quantity,
                    visibility: visibility,
                    images: imageFullUrl, // Use the complete image URL
                    category: categoryId,
                    subcategory: subcategoryId,
                });
                await product.save();
            } else {
                console.log('Product not saved');
            }
        }

        return res.status(200).json({ message: 'Products and images uploaded successfully' });
    } catch (error) {
        console.error('Error uploading products and images:', error);
        return res.status(500).json({ error: 'Error uploading products and images' });
    }
});










module.exports = router;