const express = require("express");
const collection = require("../models/mongodb");
const route = express.Router();
// <----------------------------------------------------------->
route.get("/", (req, res) => {
  try {
    if (req.session.token) {
      res.render("home");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

route.get("/login", (req, res) => {
  try {
    if (req.session.token) {
      res.redirect("/");
      return;
    }
    if (req.session.admin) {
      res.redirect("/dashboard");
      return;
    }
    let userinfo = "";
    if (req.session.userinfo) {
      userinfo = req.session.userinfo;
      delete req.session.userinfo;
    }
    res.render("login", { userinfo });
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

route.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await collection.findOne({ name, password });
    if (user) {
      if (user.admin) {
        req.session.admin = true;
        console.log(user.admin);
        res.redirect("/dashboard");
      } else if (!user.admin) {
        req.session.token = true;
        res.redirect("/");
      }
    } else {
      req.session.userinfo = "user not found";
      res.redirect("/login");
    }
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

// <----------------------------------------------------------->

route.get("/signup", (req, res) => {
  try {
    if (req.session.token) {
      res.redirect('/')
      return
    }
    if (req.session.admin) {
      res.redirect('/dashboard')
      return
    }
    res.render("signup");
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

route.post("/signup", async (req, res) => {
  try {
    
    const searchUser = await collection.findOne({ name: req.body.name });
    if (!searchUser) {
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      await collection.create(data);
      req.session.token = true
    }
    res.redirect("/");
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

// <----------------------------------------------------------->

route.get("/dashboard", async (req, res) => {

  try {
    if (req.session.token) {
      res.redirect("/");
      return;
    }
    if (req.session.admin) {
      let data = await collection.find({});
      const searchQuery = req.query.search;
      if (searchQuery) {
        const regex = new RegExp(searchQuery, "i");
        data = data.filter((user) => regex.test(user.name));
      }
      res.render("dashboard", { data });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

// <----------------------------------------------------------->
route.get("/add-user", (req, res) => {
  res.render("add-user");
});

route.post("/add-user", async (req, res) => {
  try {
    const searchUser = await collection.findOne({ name: req.body.name });
    if (searchUser) {
      return res.redirect("/add-user");
    }
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    await  collection.create(data);
    res.redirect("/dashboard")
  } catch (err) {
    console.log(err);
    res.status(404)
  }
});

// <----------------------------------------------------------->

route.get("/update-user", async (req, res) => {
  try {
    const userId = req.query.id;
    const data = await collection.findOne({ _id: userId });
    res.render("update-user", { data });
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});

route.post("/update-user", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin == "true" ? true : false,
    };
    console.log(data);
    await collection.findOneAndUpdate({ _id: req.body.id }, { ...data });
    res.redirect("/dashboard");
  } catch (error) {
    console.log("error", error);
    res.status(404);
  }
});
// <------------------------------------------------------------->
route.delete("/delete-user/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let a = await collection.findByIdAndDelete(req.params.id);

    console.log(a);
    res.send(200);
  } catch (error) {}
});
// <----------------------------------------------------------->
route.post("/search", async (req, res) => {
  try {
    const searchName = req.body.searchName;
    const regex = new RegExp(searchName, "i");

    const searchResults = await collection.find({ name: regex }).toArray();

    res.render("dashboard", { data: searchResults }); // Passing searchResults as "data"
  } catch (error) {a
    console.log("Error during search:", error);
    res.status(500).json({ error: "An error occurred during the search" });
  }
});

// <----------------------------------------------------------->
route.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = route;
