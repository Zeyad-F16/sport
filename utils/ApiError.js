class ApiError extends Error{
    constructor(message  , statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4)?'fail':'Error';
        this.isOperational = true;  // error that I can predict 
    }};

module.exports = ApiError;