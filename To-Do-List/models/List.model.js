const { Schema, model } = require('mongoose');

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  },
  {
    timestamps: true, //?
  }
);

const List = model('List', listSchema);

module.exports = List;
