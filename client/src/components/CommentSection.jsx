import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CommentSection = ({ productId }) => {
  const { axios, user } = useAppContext();
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("");

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comment/${productId}`);
      if (data.success) {
        setThreads(data.threads);
      }
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (user.role === "owner") {
        let threadId = threads.find(
          (t) => t.owner._id === user._id
        )?._id;

        if (!threadId) {
          await axios.post("/api/comment/send", {
            productId,
            text: message,
          });
        } else {
          await axios.post("/api/comment/reply", {
            threadId,
            text: message,
          });
        }
      } else {
        await axios.post("/api/comment/send", {
          productId,
          text: message,
        });
      }

      setMessage("");
      fetchComments();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  //  FLATTEN ALL MESSAGES
  const allMessages = threads
    .flatMap((thread) => thread.messages)
    .sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {/* SINGLE COMMENT BOX */}
      <div className="p-4 border rounded-lg shadow-sm max-h-96 overflow-y-auto">
        {allMessages.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded max-w-[80%] ${
              msg.sender._id === user._id
                ? "ml-auto bg-blue-100 text-blue-800 text-right"
                : "mr-auto bg-gray-100 text-gray-800 text-left"
            }`}
          >
            <strong>{msg.sender.name}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      {user && (
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border px-3 py-2 rounded-lg"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;

