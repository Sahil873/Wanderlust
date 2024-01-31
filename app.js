// dotenv file is used only in development phase
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // create layout templates like navbars footers, etc
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL;

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // hrs
});

store.on("error", () => {
  console.log("Error in Mongo Session Store - ", error);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// defining passport stuff
app.use(passport.initialize()); //  a middleware that initializes passport
app.use(passport.session()); //to know if same user is making different requests/har ek request ko pata ho ki vo konse session ka part hai
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// root
// app.get("/", (req, res) => {
//   res.send("I m root.");
// });

app.use("/", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found "));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "SOME THING WENT WRONG!!!" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
