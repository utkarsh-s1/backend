class ApiError extends Error {
    constructor(statusCode, message="Something went wrong",errors=[], stack="" ){
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.data = null
        this.message = message
        console.log(this.message)
        this.success = false
        if(stack){
            StyleSheetList.stack  = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {ApiError}