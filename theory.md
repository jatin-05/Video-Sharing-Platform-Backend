nodemon --  we need to start our server again and again when we make changes so to avoid this we use nodemon. it just restart the server whenever we save our changes 
also it is a dev dependency , ie it is required only during development tie not during production 
npm i nodemon  (instals as a main dependency)
npm install --save-dev nodemon     OR npm install -D nodemon
now in package.json add a script 
"dev":"nodemon src/index.js"




when we make empty folders they are not tracked by git so we can make file named .gitkeep so that the tructure of the folders we make at start gets tracked by git   



prettier pakage is used to make the syntax structure same for all the workers
npm i -D prettier 
now make a file .prettierrc (this include the configurations)
also .prettierignore (ignores where you dont want his syntax structure   )



connection to mongo db 
    go to atlas mongodb and create a project (see video 7 if forgotten )
    to do a connection you need 
        1)ip addredd
        2)username password 
        3) a string (store it in env)(get is from -->database section --> connect --> choose a option)



we use app.use()  (when we do middleware or configuration settings )



cookie parser
npm i cookie-parser



cors( u can set various configurations like origin from where backend can accept req)(see docs )
npm i cors




middlewares 
when a request comes on a route , before actuelly processing it and sending a response we can add middlewares
for ex a req came , before doing it we can add a check if user is logged in or not 

What is next in Middleware?
Middleware functions have this signature:
function (req, res, next) { ... }
The third argument, next, is a function you call when your middleware is done so Express knows to move on.






FILE UPLOAD 
    we can do file upload on aws (or cloudinary free)
    to do so we need some pakage 
    - expressfileupload or 
    - multer (used in this project)