const { Schema, model } = require('mongoose');

const itemSchema = new Schema(
  {
    name: {
      type: String,
    },
    done: Boolean,
    deadline: String,
    deadlinePassed: Boolean,
  },
  {
    timestamps: true, // ?
  }
);

const Item = model('Item', itemSchema);

module.exports = Item;
