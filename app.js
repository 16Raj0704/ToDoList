const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");

const app = express();

app.set("view engine", "ejs");

// todoList database and connect it 
mongoose.connect("mongodb+srv://raj-mohite:mongodb-123@cluster0.welphwv.mongodb.net/todoListDB");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); /* to add CSS file of the public folder */ 

// schema for items
const itemSchema = new mongoose.Schema({
    name: String

});

// create model for items
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to the To Do List"

});

// item1.save();

const item2 = new Item({
    name: "Click on + to add item"

});

// item2.save();

const item3 = new Item({
    name: "<-- click this to remove the item"

});

// item3.save();

// add items in array
const itemList = [item1, item2, item3];

const customSchema = new mongoose.Schema({
    name: String,
    item: [itemSchema]

});

const Custom = mongoose.model("Custom", customSchema);


// app.get("/", function(req, res){
//     Item.find({}, (foundItems, err) => {
//         if(foundItems === 0){
//             Item.insertMany(itemList);
//             res.redirect("/");

//         } else if(err){
//             console.log(err);
//             res.redirect("/");

//         } else {
//             res.render("backend", {kindOfDay: "Today", AddItem: foundItems});
//         }
//     })
//     });

app.get("/", function(req, res){
    Item.find({})
    .then(function(foundItems){
        if(foundItems === 0){
            Item.insertMany(itemList)
            .then(function(){
            console.log("Successfully added items in list.");
    })
            .catch(function(err){
            console.log(err);

            res.redirect("/");
    })
    } else { 
        res.render("backend", {kindOfDay: "Today", AddItem: foundItems});
    }
    });

});

app.post("/", function(req, res){
    let itemName = req.body.AddItem;

    const item = new Item({
        name: itemName

    });

    item.save();
    res.redirect("/");

});

app.post("/delete", function(req, res){
    const checkItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkItemId)
        .then(function(err){
        if(!err){
            console.log("Successfully deleted checked item");

        }
        res.redirect("/");
    });

});

app.get("/:customListName", function(req, res){
    const customListName = req.params.customListName;

    Custom.findOne({name: customListName})
    .catch(function(err, foundItems){
        if(!err){
            if(!foundItems){ 
                const custom = new Custom({
                    name: customListName,
                    item: itemList
            
                });
            
                res.redirect("/" + customListName);
                custom.save();

            } else {
                res.render("backend", {kindOfDay: foundItems.name, AddItem: foundItems.name});

            }
        }

    });

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is started on port: 3000");

});
