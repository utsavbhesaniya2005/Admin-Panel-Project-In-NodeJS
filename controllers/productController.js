const Product = require("../models/productModel");
const Activity = require('../models/activityModel');
const fs = require('fs');

var user;

const allProducts = async (req, res) => {

    user = req.user;

    let products = await Product.find({});

    res.render('allProducts', { user, products });
}

const add = async (req, res) => {

    res.render('addProduct', { user });
}

const saveProduct = async (req, res) => {

    try {

        const { pname, description, category, expireDate, stock, price } = req.body;

        const { path } = req.file;

        const newProduct = await Product.create({
            pname,
            description,
            category,
            expireDate,
            stock,
            productImage: path,
            price,
            adminId: user.id,
        });

        await Activity.create({
            status: 'New Product Added.',
            productId: newProduct._id,
        });

        console.log('Product Added & Activity Added.');

        res.redirect('/');

    } catch (err) {

        console.log('Adding Product Error: >>', err);
    }

}

const edit = async (req, res) => {

    let product = await Product.findOne({ _id: req.params.id });

    res.render('editProduct', { user, product });
}

const update = async (req, res) => {

    let findProductImg = await Product.findById(req.params.id);

    fs.unlink(findProductImg.productImage, (err) => {

        console.log('Product Image Updated.');
    });

    let data = {
        ...req.body, productImage: req.file.path,
    };

    await Product.findByIdAndUpdate(req.params.id, data);

    await Activity.create({

        status: 'Product Updated',
        productId: req.params.id,
    });

    console.log("Product Updated.");

    res.redirect('/');
}

const deleteProduct = async (req, res) => {

    let findProductImg = await Product.findById(req.params.id);

    fs.unlink(findProductImg.productImage, (err) => {

        console.log('Product Image Deleted.');
    });


    await Activity.create({

        status: 'Product Deleted',
        productId: req.params.id,
    });

    await Product.findByIdAndDelete(req.params.id);

    console.log('Product Deleted.');

    res.redirect('/');
}

const deleteAll = async (req, res) => {

    try {

        const { productIds } = req.body;

        const productIdArray = productIds.split(' ');

        productIdArray.forEach(async (productId) => {

            let findProductImg = await Product.findById({ _id: productId });

            if (findProductImg) {

                fs.unlink(findProductImg.productImage, (err) => {

                    console.log('Product Image Deleted.');
                });

                await Activity.create({

                    status: 'Product Deleted',
                    productId: productId,
                });

                await Product.deleteMany({ _id: { $in: productId } });

            }
        });
    
        res.redirect('/');
    }catch(err){

        console.log('Selected Product Delete Error.');
    }
}

const deleteActivity = async (req, res) => {

    await Activity.findByIdAndDelete(req.params.id);

    res.redirect('/');
}

module.exports = { allProducts, add, saveProduct, edit, update, deleteProduct, deleteAll, deleteActivity };