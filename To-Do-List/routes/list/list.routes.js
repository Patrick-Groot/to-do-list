const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');
const Item = require('../../models/Item.model');

router.post('/newlist', async (req, res, next) => {
  //console.log(req.body.listName);
  const newList = await List.create({ name: req.body.listName });
  console.log('New list: ', newList);
  //console.log(req.user.id);
  //const listId = await List.findOne();
  const foundUser = await User.findByIdAndUpdate(req.user.id, { $push: { lists: newList._id } });
  await foundUser.populate('lists');
  console.log(foundUser);
  res.render('dashboard', { foundUser });
});

// TODO: fix url
router.post('/:id', async (req, res, next) => {
  const list = await List.findById(req.params.id);
  await list.populate('items');
  console.log(list);
  res.render('myList', { list });
});

router.post('/:id/newitem', async (req, res, next) => {
  const newItem = await Item.create({ name: req.body.itemName });
  console.log('New item: ', newItem);

  const foundList = await List.findByIdAndUpdate(req.params.id, { $push: { items: newItem._id } });
  await foundList.populate('items');
  console.log(foundList);
  res.render('myList', { list: foundList });
});

router.post("/:listId/:itemId/delete", async (req, res, next) => {  
    const listWithItemToDelete = await List.findByIdAndUpdate(req.params.listId, { $pull: { items: req.params.itemId }});
    console.log(listWithItemToDelete);
    const itemToDelete = await Item.findByIdAndDelete(req.params.itemId);
    await listWithItemToDelete.populate('items');
    res.render('myList', { list: listWithItemToDelete });
});

module.exports = router;
