import { useUserContext } from "@/context/AuthContext";
import { useAddComment, useDeleteComment, useEditComment } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CommentsSection({ post }: any) {
  const { user } = useUserContext();
  const { mutateAsync: addComment} = useAddComment(post.$id);
  const { mutateAsync: editComment, isPending: isEditingComment } = useEditComment(post.$id);
  const { mutateAsync: deleteComment} = useDeleteComment(post.$id);

  // Initial comments from the post
  const [comments, setComments] = useState(post.comments);
  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  // New comment text
  const [newComment, setNewComment] = useState("");

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // Add a comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const status = await addComment({
      userID: user.id,
      comment: newComment,
    });
    setNewComment("");
    
    if (!status) {
      toast.error("Failed to comment. Please try again.");
    }

    return status;
  };

  // Start editing
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(comments[index].comment);
  };

  // Save edited comment
  const handleSave = async (index: number) => {
    if (!editingText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const status = await editComment({
      commentID: comments[index].$id,
      comment: editingText,
    });

    if (!status) {
      toast.error("Failed to edit comment. Please try again.");
    }

    setEditingIndex(null);
  };

  // Delete a comment
  const handleDelete = async (index: number) => {
    const status = await deleteComment(comments[index].$id);

    if (!status) {
      toast.error("Failed to delete comment. Please try again.");
      return;
    }
  };

  return (
    <div className="post_details-comment_section">
      <h1 className="text-xl font-semibold mb-6">Comments</h1>

      {/* Input area */}
      <div className="flex items-start gap-3 mb-6">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
          alt={user.name}
        />
        <div className="flex-grow">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-600 focus:border-white p-2 outline-none text-sm"
          />
          {newComment && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setNewComment("")}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="post_details-comments_list">
        {comments.map((comment:any , index:any) => (
          <div key={index} className="flex items-start gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={comment.commenter.imageURL}
              alt={comment.commenter.name}
            />
            <div className="flex-grow">
              {/* Edit mode */}
              {editingIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-600 p-1 outline-none text-sm"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleSave(index)}
                      className="text-blue-500 hover:text-blue-400 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Display mode */}
                  <div>
                    <span className="body-bold text-sm">{comment.commenter.name}</span>
                    <p className="text-sm mt-1">{comment.comment}</p>
                  </div>

                  <div className="flex gap-4 text-xs items-center text-gray-400 mt-2">
                    <span>
                      {timeAgo(comment.$updatedAt)}
                    </span>
                    {/* Edit/Delete buttons only for current user */}
                    {comment.commenter.$id === user.id && (
                      <div className="flex gap-4 text-xs items-center text-gray-400">
                        <button
                          onClick={() => handleEdit(index)}
                          className="hover:text-white hover:underline"
                          disabled={isEditingComment}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="hover:text-white hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
