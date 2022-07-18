const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');

//Login Page
router.get('/login',(req,res)=>{
    res.render('login');
});

//Register Page
router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    // console.log(req.body);
    // res.send('Hello');
    const {name,email,password,password2}=req.body;

    let errors=[];
    if(!name||!email||!password||!password2){
        errors.push({msg:'Please fill in all the fields'});
    }
    if(password!==password2){
        errors.push({msg:'Passwords dont match'});
    }

    if(password.length<6){
        errors.push({msg:'Password should contain atleast 6 characters'});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });

    }
    else{
        //res.send('Pass');
        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10,(err,salt)=>
                  bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    //Set Password to hashed  
                    newUser.password=hash;
                    //save User
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are now registered and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                  }))
                // console.log(newUser);
                // res.send('Hello world');
            }
        })
    }
});

//Login Page
router.post('/login',(req,res,next)=>{
   passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
   })(req,res,next);
});

//logout page
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
    req.flash('success_msg','You are successfully logout');
    res.redirect('/users/login');
  });
});

module.exports=router;