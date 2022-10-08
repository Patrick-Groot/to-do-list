const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');

router.post("/newlist", async (req, res, next) => {
    //console.log(req.body.listName);
    const newList = await List.create({ name: req.body.listName });
    console.log("New list: ", newList)
    //console.log(req.user.id);
    //const listId = await List.findOne();
    const currentUser = await User.findByIdAndUpdate(req.user.id, {$push: {lists: newList._id}});    
    await currentUser.populate("lists");
    console.log(currentUser);
    res.render("myLists", {currentUser});
});

module.exports = router;