const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');
const Item = require('../../models/Item.model');
const { isDarkmode } = require('../../middleware/middleware.js');

// POST got to list
router.post('/:id', async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id);
    await list.populate('items');
    req.session.list = list;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// GET go to list
router.get('/list', isDarkmode, async (req, res, next) => {
  const darkmode = req.darkmode;
  try {
    sortedList = JSON.parse(JSON.stringify(req.session.list));
    sortedList.items
      .sort((a, b) => {
        return b.deadline ? 1 : -1;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    sortedList.items.forEach((item) => {
      const date = new Date();
      date.setDate(date.getDate());
      date.setHours(0, 0, 0, 0);
      if (new Date(item.deadline) < date) {
        item.deadlinePassed = true;
      }
    });
    res.render('user/myList', { list: sortedList, darkmode });
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// POST new list item
router.post('/:id/newitem', async (req, res, next) => {
  try {
    const nameForNewItem = req.sanitize(req.body.itemName);
    const deadlineForNewItem = req.sanitize(req.body.itemDeadline);
    const newItem = await Item.create({
      name: nameForNewItem,
      deadline: deadlineForNewItem,
      done: false,
      deadlinePassed: false,
    });
    const foundList = await List.findByIdAndUpdate(
      req.params.id,
      {
        $push: { items: newItem._id },
      },
      { new: true }
    );
    await foundList.populate('items');
    req.session.list = foundList;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// POST delete list item
router.post('/:listId/:itemId/delete', async (req, res, next) => {
  try {
    const listWithItemToDelete = await List.findByIdAndUpdate(
      req.params.listId,
      {
        $pull: { items: req.params.itemId },
      },
      { new: true }
    );
    await Item.findByIdAndDelete(req.params.itemId);
    await listWithItemToDelete.populate('items');
    req.session.list = listWithItemToDelete;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// POST mark item as "done" or "undone"
router.post('/:listId/:itemId/done', async (req, res, next) => {
  try {
    const itemToMark = await Item.findById(req.params.itemId);
    if (itemToMark.done === false) {
      await Item.findByIdAndUpdate(req.params.itemId, { done: true });
    } else await Item.findByIdAndUpdate(req.params.itemId, { done: false });
    const list = await List.findById(req.params.listId);
    await list.populate('items');
    req.session.list = list;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// POST edit list item
router.post('/:listId/:itemId/edit', async (req, res, next) => {
  try {
    const newNameForItem = req.sanitize(req.body.name);
    let newDeadlineForItem = req.sanitize(req.body.deadline);
    if (newDeadlineForItem === undefined) {
      newDeadlineForItem = '';
    }
    const listWithItemToEdit = await List.findById(req.params.listId);

    await Item.findByIdAndUpdate(
      req.params.itemId,
      {
        name: newNameForItem,
        deadline: newDeadlineForItem,
      },
      { new: true }
    );

    await listWithItemToEdit.populate('items');
    req.session.list = listWithItemToEdit;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

// POST edit list name
router.post('/list/edit/:listId', async (req, res, next) => {
  try {
    const newNameForList = req.sanitize(req.body.name);

    const listToEditName = await List.findByIdAndUpdate(
      req.params.listId,
      {
        name: newNameForList,
      },
      { new: true }
    );

    await listToEditName.populate('items');
    req.session.list = listToEditName;
    res.redirect('/list');
  } catch (err) {
    console.error('Sorry, there was an error: ', err);
    res.render('error');
  }
});

module.exports = router;
