//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shobhith:Test123@cluster0.8mlsl.mongodb.net/todolistDB", {useNewUrlParser:true, useUnifiedTopology: true});

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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

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


  app.get("/:paramName", function(req,res){
    const customListName = _.capitalize(req.params.paramName);

    

    List.findOne({name: customListName}, (err,found)=>{
      
    if(!err){
    if(!found){
        const list = new List({
        name: customListName,
        items: defaultItems
          });
        list.save();
        res.redirect("/"+ customListName);
      }
    else{
      res.render("list", {listTitle: found.name, newListItems: found.items  })
    }
    }
  });

    });
 
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  
 
 const insertedItem  =new Item({
    name: itemName
 });

 if(listName === "Today"){
  insertedItem.save();
  res.redirect("/");
 } else {

  List.findOne({name: listName},function(err,foundList){

    foundList.items.push(insertedItem);
    foundList.save();
    res.redirect("/"+ listName);
  });
 }


});

app.post("/delete", (req,res)=>{

  const id = req.body.checkbox;
  const listName = req.body.listName;

  

  if(listName === "Today"){

    Item.findByIdAndRemove(id, (err)=>{
    if(err) console.log(err)
    else{
    console.log("deleted succesfully");
    }
    res.redirect("/");
    });
  }
  else{
        
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: id}}},(err,foundList)=>{
    if(err) console.log(err)
    else{
    console.log("deleted succesfully");
    }
    res.redirect("/"+listName);
    });
    
  }
});



app.get("/about", function(req, res){
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
