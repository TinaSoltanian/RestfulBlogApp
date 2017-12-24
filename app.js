//APP CONFIG
var express     = require("express"),
    app         = express(),
    bodyParses  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override");
    
mongoose.connect("mongodb://localhost/rest-blog-app",{useMongoClient: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParses.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//MANGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTING
// Blog.create({
//     title: "Test Blog",
//     image: "https://i.pinimg.com/736x/5a/59/7b/5a597b465949c8e1dc2198c542dbeb2d--unique-flowers-amazing-flowers.jpg",
//     body: "HELLO THIS IS A BLOG POST"
// }, function(err, blog){
//   if(err) {
//       console.log(err);
//   } else{
//       console.log(blog);
//   }
// });
app.get("/",function(req, res){
    res.render("index");
});

app.get("/blogs",function(req, res){
    Blog.find({}, function(err, allBlogs){
       if (err) {
           console.log(err);
       } else {
            res.render("index",{blogs: allBlogs});    
       }
    });
});

app.get("/blogs/new", function(req, res){
   res.render("new");
});

app.post("/blogs",function(req, res){
    Blog.create(req.body.blog, function(err, neBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
          res.redirect("/blogs");
       }
       else{
           res.render("show", {blog: foundBlog});
       }
   })
});

app.get("/blogs/:id/edit", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
          res.redirect("/blogs");
       }
       else{
           res.render("edit", {blog: foundBlog});
       }
   })
});

app.put("/blogs/:id", function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }
      else{
          res.redirect("/blogs/" + req.params.id);
      }
  })
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server has started");
});