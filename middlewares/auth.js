// const auth = (req, res, next) => {

//     try{
//         let {uId} = req.cookies;

//         if(uId){
//             next();
//         }else{
//             res.redirect('/login');
//         }
//     }catch(err){
        
//         res.redirect('/login');
//     }
// }

// const loginMiddleware = (req, res, next) => {

//     try{

//         let {uId} = req.cookies;
    
//         if(uId){
//             res.redirect('/');
//         }else{
//             next();
//         }
//     }catch(err){

//         next();
//     }
// }

const auth = (req, res, next) => {

    try{

        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect('/login');
        }
    }catch(err){
        
        res.redirect('/login');
    }
}

// const login = (req, res, next) => {

//     try{

//         if(req.isAuthenticated()){

//             res.redirect('/');
//         }else{
            
//             res.redirect('/login');
//         }

//     }catch(err){

//         res.redirect('/login');
//     }
// }

module.exports = {auth};