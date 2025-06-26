
// this is just a wrapper to hanle async func / so that we dont have to write try catch again and again 
//el func input lia uska async handle krke wapas ek func return krdia 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))   // promise.resolve creates a promise out of any thing (if it was already a promise then no change )  
    }  /* here when next(err) hits express knows it is an error and it automatically sends it to your error handler like:
                app.use((err, req, res, next) => {
                // this block catches the error
                res.status(err.statusCode || 500).json({ message: err.message });

                meaning no further middleware or controller is run if this hits 
                if no error handler is there then Express will use its built-in default error handler. (HTML)
                this will include the status code and message in err else deafault 
                });*/

}


export { asyncHandler }




/*   WRAPPER FUNCTION   
JS is a higher order language meaning it can take input as a func and also return a func

when we write 
const xyz = () =>{}
actually here arrow func returns a func directly and it gets saved in xyz 

const asyncHandler = () => {}   
const asyncHandler = (func) =>{ () => {} }       // here when u run asyncHandler(func)  then it inturn returns a func  // ie it is taking a func as input plus returning a func also 
const asyncHandler = (func) => async () => {}
OR
const async handler =(func)=> { return async ()=> {}} 

*/ 

/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
    */
   