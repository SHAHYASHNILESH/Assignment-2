const express=require('express');
const router=require('./routes/index');
const users=require('./routes/users');
const expressLayouts=require('express-ejs-layouts');
const path = require('path'); 
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

const app=express();

require('./config/passport')(passport);

//Database connection
const mongoose=require('mongoose');


const db_link='mongodb+srv://admin:RSZHek7KCmdYYSPn@cluster0.ptf4r.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(db_link)
.then(function(db){
    console.log('db connected successfully');
})
.catch(function(err){
    console.log(err);
})



//ejs
app.use(expressLayouts);
app.set('views', path.join(__dirname, './views'));
app.set('view engine','ejs');


//body parser
app.use(express.urlencoded({extended:false}))

//express-session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
//Connect-flash
app.use(flash());


//Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


app.use('/',router);
app.use('/users',users);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`server started on port ${PORT}`));


app.listen(3000);
