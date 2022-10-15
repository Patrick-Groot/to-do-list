const router = require("express").Router();
const List = require("../../models/List.model");
const User = require("../../models/User.model");
const Item = require("../../models/Item.model");

// require auth middleware
const { isLoggedIn } = require("../../middleware/route-guard.js");

// GET Dashboard
router.get("/dashboard", isLoggedIn, async function (req, res, next) {
  try {
    const foundUser = await User.findById(req.user.id);
    console.log("Found User Name: ", foundUser.username);

    await foundUser.populate("lists");
    res.render("user/dashboard", { foundUser });
  } catch (err) {
    console.error("Sorry, there was an error: ", err);
    res.render("error");
  }
});

// POST New list
router.post("/newlist", async (req, res, next) => {
  try {
    const nameForNewList = req.sanitize(req.body.listName);
    const newList = await List.create({ name: nameForNewList });
    console.log("New list: ", newList);
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { lists: newList._id },
      },
      { new: true }
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Sorry, there was an error: ", err);
    res.render("error");
  }
});

// POST edit list name
router.post("/:listId/edit", async (req, res, next) => {
  try {
    const newNameForList = req.sanitize(req.body.name);
    await List.findByIdAndUpdate(
      req.params.listId,
      {
        name: newNameForList,
      },
      { new: true }
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Sorry, there was an error: ", err);
    res.render("error");
  }
});

// Post delete list
router.post("/:listId/delete", async (req, res, next) => {
  try {
    const foundListToDelete = await List.findById(req.params.listId);
    if (foundListToDelete.items) {
      foundListToDelete.items.forEach(async (elem) => {
        console.log(elem);
        await Item.findByIdAndDelete(elem);
      });
    }
    await List.findByIdAndDelete(req.params.listId);
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Sorry, there was an error: ", err);
    res.render("error");
  }
});

module.exports = router;
