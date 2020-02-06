// Import modules

var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    queryString = require("querystring"),
    request = require("request"),
    timeout = require("connect-timeout");

// Application setup

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(timeout("60s"));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://utkarsh:sona2503@cluster0-0cl3l.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// Models

var cookSchema = new mongoose.Schema({
    username: { type: String, default: "default_username" },
    password: { type: String, default: "password" },
});

var recepieSchema = new mongoose.Schema({
    name: { type: String, default: "New Recepie" },
    cook: { type: String },
    description: { type: String },
    steps: { type: String },
    image: { type: String }
});

var ingredientSchema = new mongoose.Schema({
    name: { type: String, default: "New Ingredient" },
    recepies: { type: Array }
});

var Cook = mongoose.model("Cook", cookSchema);
var Recepie = mongoose.model("Recepie", recepieSchema);
var Ingredient = mongoose.model("Ingredient", ingredientSchema);

// Routes
// ===========================================================

app.get("/", function (req, res) {
    res.render("welcome");
});

// Signup

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var r = req.body.r;

    if (password !== r) {
        res.redirect(302, "/signup");
    }

    else {
        User.find({
            username: username,
            password: password
        }, function (err, user) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(user);
                if (user.length === 0) {
                    User.create({
                        username: username,
                        password: password
                    }, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("User creation done");
                            console.log(user);
                            console.log(session);

                            var url = "/landing/" + user._id;
                            console.log(url);
                            res.redirect(302, url);
                        }
                    });
                }
                else {
                    console.log("The user is registered!");
                    res.redirect(302, "/login");
                }
            }
        });
    }
});

// Login

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.find({
        username: username,
        password: password
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(user);
            console.log(session);
            if (user.length === 0) {
                console.log("Credentials are not right");
                res.redirect(302, "/login");
            }
            else {
                var url = "/landing/" + user[0]._id;
                console.log(url);
                res.redirect(302, url);
            }
        }
    })
});

// ===========================================================

var port = process.env.PORT || 8090;

app.listen(port, process.env.IP, function (req, res) {
    console.log("The Recepies App has started!");
});