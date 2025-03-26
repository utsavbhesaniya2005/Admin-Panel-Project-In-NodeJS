const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {

        if(file.fieldname === 'avatar'){

            cb(null, 'uploads/avatar');
        }else{

            cb(null, 'uploads/productImg');
        }
    },
    filename : (req, file, cb) => {

        let fileName = Date.now() + '_' + Math.round(Math.random() * 1E9) + file.originalname;

        cb(null, fileName);
    }
});

const uploads = multer({storage});

module.exports = uploads;