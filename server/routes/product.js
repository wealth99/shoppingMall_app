const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
});
   
var upload = multer({ storage: storage }).single('file');

router.post('/image', (req, res) => {
    // 가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if(err) {
            return req.json({ success: false, err});
        } else {
            return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.name });
        }
    })
});

router.post('/', (req, res) => {
    // 받아온 정보들을 DB에 넣어 준다
    const product = new Product(req.body);

    product.save((err) => {
        if(err) {
            return res.status(400).json({ success: false, err })
        } else {
            return res.status(200).json({ success: true })
        }
    })
    
});

function isNumeric(s) {
    if (typeof s !== 'string') return false;
    return !isNaN(s) && !isNaN(parseFloat(s));
}

router.post('/products', (req, res) => {
    // produdct collection에 들어 있는 모든 상품 정보를 가져오기

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;

    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            console.log('key: ', key);
            if(key === 'price') {
                findArgs[key] = {
                    // Greater than equal
                    $gte: req.body.filters[key][0],
                    // Less than equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if(term) {
        const findRegex = new RegExp(term);
        Product.find(findArgs)
        .find( { $or: [{ title: findRegex }, { description: findRegex }, { price: isNumeric(term) ? Number(term) : null }] })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, productsInfo) => {
            if(err) return res.status(400).json({ success: false, err});
            return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length });
        })
    } else {
        Product.find(findArgs)
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, productsInfo) => {
            if(err) return res.status(400).json({ success: false, err});
            return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length });
        })
    }
});

module.exports = router;
