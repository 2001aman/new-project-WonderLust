if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const  ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const db_Url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
    async function main() {
        await mongoose.connect(db_Url);
    }


    
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,  "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
  mongoUrl : db_Url,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

store.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
    
  }
};


app.all("*", (req, res) => {
  res.send(listings);
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// app.get("/demouser", async (req,res) => {
//   let fakeUser = new User({
//     email: "amankusw@gmail.com",
//     username: "amankusha"
//   });
//   let registeredUser = await User.register(fakeUser, "helloan");
//   res.send(registeredUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
  
  
  // app.all("*", ( req ,res, next) => {
  //   next(new ExpressError(404,"Page Not Found" ));
  // });

  app.use((err, req, res , next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
      // res.status(statusCode) .send(message);
  });
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
  
