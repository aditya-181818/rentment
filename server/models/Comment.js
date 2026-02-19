import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
  sender: { type: ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product", required: true },
    user: { type: ObjectId, ref: "User", required: true }, // person who asks
    owner: { type: ObjectId, ref: "User", required: true }, // product owner
    messages: [messageSchema],
  },
  { timestamps: true }
);


const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;

