require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;

const employeeController = require('./controllers/employeeController');
const multer = require('multer');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));


// ----------------------------------Set Storage Engine--------
const  storage  = multer.diskStorage({
    destination: './public/uploads/',
    filename:function (req ,file , cb) {
         cb(null,file.fieldname  + '-' + Date.now() + 
         path.extname(file.originalname));
    }
}) 

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    // fileFilter:function ( req, file, cb) {
    //     checkFileType(file,cb);
    // }

}).single('myImage');

// Check File Type
function checkFileType(file , cb) {
    // alert('d');
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.minetype);

    if (mimetype && extname) {
        return cb(null,true);
    }else {
        cb('Error : images only');
    }
}




// ----------------------------------ejs--------

app.set('view  engine' , 'ejs');


// ----------------------------------ejs--------
// ----------------------------------static Folders--------

app.use(express.static('./public'));
// ----------------------------------static Folders--------

app.get('/', (req, res) => res.render('index.ejs'));




app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.post('/upload', (req, res) => {

    upload(req,res ,(err)=> {
        
        if(err){
            res.render('index.ejs',{
                msg : err
            });
        }else{
            if (req.file == undefined) {
                res.render('index.ejs',{
                    msg : "Error no file selected !"
                });
            }else {
                res.render('index.ejs',{
                    msg : "File Uploaded !",
                    file : `Uploads/${req.file.filename}`,
                 
                     
                });
                  
            }
        }
        
    });
});


app.listen(port, () => {
    console.log(`Express server started at port : ${port}`);
});

app.use('/employee', employeeController);