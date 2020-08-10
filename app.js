//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const favicon = require('serve-favicon');
const app = express();
const path = require('path');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(path.join('public', 'favicon.ico')));

mongoose.connect("Place your own database",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

const itemsSchema = {
  name : String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the add button!"
});
const defaultItems = [item1,item2];
const day = date.getDate();
app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
    //If foundItems length of array is zero
    //Save the default data
    if(foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success");
        }
      });
      //Redirect to root route
      res.redirect("/");
    }else{
        //Else simply render the list page
        res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete" , function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted");
    }
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if(port == null || port == ""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
