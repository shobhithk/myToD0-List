//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("item",itemsSchema);

const sleep = new Item({
  name: "Sleep"
});

const walk = new Item({
  name: "morning Walk"
});

const freshup = new Item({
  name: "time to fresh up"
});

const defaultItems = [sleep, walk, freshup];




app.get("/", function(req, res) {


  Item.find({},(err,data)=>{
    
    if(data.length === 0){

      Item.insertMany(defaultItems, (err)=>{
      if(err){
          console.log(err);
      }else
          console.log("succesfully inserted to collection");
      });
      res.redirect("/");
    }
    else if(err)
      console.log(err);
    else{
      res.render("list", {listTitle: "Today", newListItems: data});
    }
  });

 
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

 const insertedItem  = new Item({
    name: itemName
 });

insertedItem.save();
res.redirect("/");

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
