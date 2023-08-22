class UserError extends Error{
   
     constructor(message){
        super(message);
        this.name = 'User Error'
    }
}


module.exports = {UserError}