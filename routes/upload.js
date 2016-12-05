/**
 * Created by nghiepnds on 12/4/2016.
 */
var express = require('express');
var router = express.Router();
var multer  = require('multer');

/* GET users listing. */
router.get('/', function(req, res) {
    res.sendfile('views/upload.html');
});

router.get('/tile.component.html', function(req, res) {
    res.sendfile('views/tile.component.html');
});

// Using MULTER for a specific router,
// in case you do not want the middleware process the other routes
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

//If allow a single file upload
//var upload = multer({ storage: storage }).single('uploadedFile');

//If allow multiple files upload
var upload = multer({ storage: storage }).array('uploadedFile');

//Handle POST Form File data
router.post('/', upload, function(req, res) {
    //console.log("files:"+ req.files);
    //console.log("file:"+ req.file);
    if (!req.file && !req.files) {
        console.log('No files were uploaded.');
        res.json(req.body);
        return;
    }else{
        res.json(req.file);
    }
});

module.exports = router;
