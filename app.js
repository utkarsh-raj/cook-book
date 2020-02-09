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
    image: { type: String },
    ingredients: { type: Array }
});

var ingredientSchema = new mongoose.Schema({
    name: { type: String, default: "New Ingredient" },
    recepie: { type: String }
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
        Cook.find({
            username: username,
            password: password
        }, function (err, user) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(user);
                if (user.length === 0) {
                    Cook.create({
                        username: username,
                        password: password
                    }, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("User creation done");
                            console.log(user);
                            // console.log(session);

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
    Cook.find({
        username: username,
        password: password
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(user);
            // console.log(session);
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
    });
});

// Landing

app.get("/landing/:userId", function (req, res) {

    var userId = req.params.userId;
    console.log(userId);
    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("landing", { user: user[0] })
        }
    });
});

// Index

app.get("/index/:userId", function (req, res) {
    var userId = req.params.userId;
    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            Recepie.find({}, function (err, recepies) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(recepies);
                    res.render("index", {user: user[0], recepies: recepies});
                }
            });
        }
    });
});

// New

app.get("/new/:userId", function (req, res) {
    var userId = req.params.userId;
    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("new", { user: user[0] });
        }
    });
});

// Edit

app.get("/edit/:userId/:recepieId", function (req, res) {
    var userId = req.params.userId;
    var recepieId = req.params.recepieId;
    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            Recepie.find({
                _id: recepieId
            }, function(err, recepie) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("edit", { user: user[0], recepie: recepie[0] });
                }
            });
            // res.render("edit", { user: user[0], recepieId: recepieId });
        }
    });
});

app.post("/new/:userId", function (req, res) {
    var userId = req.params.userId;
    var name = req.body.name;
    var description = req.body.description;
    var steps = req.body.steps;
    var image = req.body.image;
    var ingredientsList = [
        req.body.ingredient1,
        req.body.ingredient2,
        req.body.ingredient3,
        req.body.ingredient4
    ];

    console.log(userId, name, description, steps, image, ingredientsList);

    // console.log(question);

    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            Recepie.create({
                name: name,
                cook: user[0].username,
                description: description,
                steps: steps,
                image: image,
                ingredients: ingredientsList
            }, function (err, recepie) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(recepie);                    
                    res.redirect(302, "/index/" + user[0]._id);
                }
            });
        }
    });
});

app.post("/edit/:userId/:recepieId", function (req, res) {
    var userId = req.params.userId;
    var recepieId = req.params.recepieId;
    var name = req.body.name;
    var description = req.body.description;
    var steps = req.body.steps;
    var image = req.body.image;
    var ingredientsList = [
        req.body.ingredient1,
        req.body.ingredient2,
        req.body.ingredient3,
        req.body.ingredient4
    ];

    console.log(userId, name, description, steps, image, ingredientsList);

    // console.log(question);

    Cook.find({
        _id: userId
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            Recepie.findByIdAndUpdate({_id: recepieId}, {
                name: name,
                cook: user[0].username,
                description: description,
                steps: steps,
                image: image,
                ingredients: ingredientsList
            }, function (err, recepie) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(recepie);                    
                    res.redirect(302, "/index/" + user[0]._id);
                }
            });
        }
    });
});

// Detail

app.get("/details/:userId/:recepieId", function(req, res) {
    Recepie.find({
        _id: req.params.recepieId
    }, function(err, recepie) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("details", {userId: req.params.userId, recepie: recepie[0]});
        }
    });
});

// Search

app.post("/search/:userId", function(req, res) {
    var userId = req.params.userId;
    var searchTerm = req.body.search_term;
    var searchType = req.body.search_type;

    searchTerm = searchTerm.toLowerCase();
    searchType = searchType.toLowerCase();

    if (searchType === "recepie") {
        Recepie.find({}, function(err, recepies) {
            if (err) {
                console.log(err);
            }
            else {
                if (recepies.length == 0) {
                    res.render("search", {recepies: []});
                }
                else {
                    var recepiesList = [];
                    var i = 0;
                    var j = 0;
                    var temp = [];
                    for (i = 0; i < recepies.length; i++) {
                        temp = recepies[i].name.split(" ");
                        for (j = 0; j < temp.length; j++) {
                            if (searchTerm === temp[j]){
                                recepiesList.push(recepies[i]);
                                break;
                            }
                        }
                        
                    } 
                    res.render("search", {recepies: recepiesList, userId: userId, search_term: searchTerm});
                }
            }
        });
    }
    else {
        Recepie.find({}, function(err, recepies) {
            if (err) {
                console.log(err);
            }
            else {
                var i = 0;
                var j = 0;
                var recepiesList = [];
                for (i = 0; i < recepies.length; i++) {
                    for (j = 0; j < 4; j++) {
                        console.log(searchTerm, recepies[i].ingredients[j]);
                        if (searchTerm === recepies[i].ingredients[j]) {

                            recepiesList.push(recepies[i]);
                            break;
                        }
                    } 
                }
                console.log(recepies);
                res.render("search", {recepies: recepiesList, userId: userId, search_term: searchTerm});
            }
        })
    }

    console.log(userId, searchTerm, searchType);
});




// ===========================================================

var port = process.env.PORT || 8090;

app.listen(port, process.env.IP, function (req, res) {
    console.log("The Recepies App has started!");
});