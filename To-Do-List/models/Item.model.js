const { Schema, model } = require('mongoose');

const itemSchema = new Schema(
  {
    name: {
      type: String,
    },
    done: Boolean,
    deadline: String,
  },
  {
    timestamps: true, // ?
  }
);

const Item = model('Item', itemSchema);

module.exports = Item;
