import multer from "multer"


//from docs(git repo )
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)  //rot so req at this point to make the name unique
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname)   
  }
})

export const upload = multer({ 
    // storage: storage
    storage     //above line and this is same in ES6
 })



/*
In multer’s code, cb is just the name of the callback function argument.

Example:
destination: function (req, file, cb) {
  cb(null, '/tmp/my-uploads');
}
Here, cb is the callback function you call to tell multer "I'm done, here's the destination."
*/




/*
HOW WE ADD THIS MIDDLEWHERE 
we use 
app.use(middlewhere)                // to apply to all the routes 

app.post('/upload', upload.single('profilePic'), (req, res) => {          //here profilepic the name given to the file int he form given by frontend multer finds that file name and do its desired task 
  // handle upload here
});

app.post( 'route' , middleware , (req , res)=>{})              // for single route 

after doing this req.file would get the file data 
and req.body will get text data 
and file would be stored at the path defined in multer.diskStorage()
*/