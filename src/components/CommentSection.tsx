
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Blog, Comment, Reaction } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  blog: Blog;
}

const EMOJIS = ["👍", "❤️", "🎉", "👏", "🙌", "🤔", "🙏"];

export default function CommentSection({ blog }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(blog.comments);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to add a comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some text for your comment",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        user: user,
        createdAt: new Date().toISOString(),
        reactions: [],
      };

      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    }
  };

  const toggleEmojiPicker = (commentId: string) => {
    setShowEmojiPicker(showEmojiPicker === commentId ? null : commentId);
  };

  const addReaction = (commentId: string, emoji: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to react to comments",
        variant: "destructive",
      });
      return;
    }

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions?.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            // Toggle user reaction
            if (existingReaction.userReacted) {
              return {
                ...comment,
                reactions: comment.reactions?.map((r) => 
                  r.emoji === emoji
                    ? { ...r, count: r.count - 1, userReacted: false }
                    : r
                ).filter(r => r.count > 0),
              };
            } else {
              return {
                ...comment,
                reactions: comment.reactions?.map((r) => 
                  r.emoji === emoji
                    ? { ...r, count: r.count + 1, userReacted: true }
                    : r
                ),
              };
            }
          } else {
            // Add new reaction
            const newReaction: Reaction = {
              emoji,
              count: 1,
              userReacted: true,
            };
            return {
              ...comment,
              reactions: [...(comment.reactions || []), newReaction],
            };
          }
        }
        return comment;
      })
    );
    setShowEmojiPicker(null);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      
      <div className="mb-6">
        <Textarea
          placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated}
          className="mb-2"
        />
        <div className="flex justify-end">
          <Button onClick={handleAddComment} disabled={!isAuthenticated || !newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.user.name}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="relative">
                      <button 
                        className="text-sm text-gray-500 hover:text-primary"
                        onClick={() => toggleEmojiPicker(comment.id)}
                      >
                        Add reaction
                      </button>
                      {showEmojiPicker === comment.id && (
                        <div className="absolute right-0 mt-1 p-2 bg-white rounded-lg shadow-lg z-10 flex">
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              className="emoji-button mx-1"
                              onClick={() => addReaction(comment.id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-gray-800">{comment.content}</p>
                  
                  {comment.reactions && comment.reactions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {comment.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          className={cn(
                            "inline-flex items-center text-xs px-2 py-1 rounded-full border",
                            reaction.userReacted 
                              ? "border-primary/30 bg-primary/10 text-primary" 
                              : "border-gray-200 bg-white text-gray-600"
                          )}
                          onClick={() => addReaction(comment.id, reaction.emoji)}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="ml-1">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
