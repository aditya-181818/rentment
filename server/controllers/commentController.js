import Comment from "../models/Comment.js";
import Product from "../models/Product.js";

// Create or update private comment thread
export const sendComment = async (req, res) => {
  try {
    const { productId, text } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const ownerId = product.owner;

    let thread = await Comment.findOne({ product: productId, user: userId, owner: ownerId });
    if (!thread) {
      thread = new Comment({
        product: productId,
        user: userId,
        owner: ownerId,
        messages: [{ sender: userId, text }],
      });
    } else {
      thread.messages.push({ sender: userId, text });
    }

    await thread.save();
    res.json({ success: true, thread });
  } catch (error) {
    console.error("Error sending comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Owner or user fetches their private thread for a product

export const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    // fetch all threads for this product
    const threads = await Comment.find({ product: productId })
      .populate("messages.sender", "name image role")
      .populate("user", "name _id") // optional
      .populate("owner", "name _id") // optional
      .sort({ updatedAt: 1 }); // sort by oldest first

    res.json({ success: true, threads });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Owner replies to a user’s comment
export const replyComment = async (req, res) => {
  try {
    const { threadId, text } = req.body;
    const ownerId = req.user._id;

    const thread = await Comment.findById(threadId);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found" });

    if (thread.owner.toString() !== ownerId.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    thread.messages.push({ sender: ownerId, text });
    await thread.save();

    res.json({ success: true, thread });
  } catch (error) {
    console.error("Error replying:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

