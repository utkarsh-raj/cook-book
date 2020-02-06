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
    steps: { type: String }
});

var ingredientSchema = new mongoose.Schema({
    name: { type: String, default: "New Ingredient" },
    recepies: { type: Array }
});

var Cook = mongoose.model("Cook", cookSchema);
var Recepie = mongoose.model("Recepie", recepieSchema);
var Ingredient = mongoose.model("Ingredient", ingredientSchema);

// ===========================================================

var port = process.env.PORT || 8090;

app.listen(port, process.env.IP, function (req, res) {
    console.log("The Recepies App has started!");
});