class CourseError extends Error{
   
     constructor(message){
        super(message);
        this.name = 'Course Error'
    }
}


module.exports = {CourseError}