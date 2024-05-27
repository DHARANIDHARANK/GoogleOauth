const router =require('express').Router();
const passport = require('passport')


router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/google',passport.authenticate('google',{scope: ['profile']})
)

router.get('/logout',(req,res)=>{
    res.send('logging out');
})
router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    res.send('you have reached the callback uri')
})

module.exports= router;