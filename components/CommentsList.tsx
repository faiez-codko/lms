"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommentsListProps {
  chapterId?: string;
  topicId?: string;
  currentUserId?: string;
  isCurrentUserAdmin?: boolean;
}

export const CommentsList = ({ chapterId, topicId, currentUserId, isCurrentUserAdmin }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (chapterId) params.append("chapterId", chapterId);
      if (topicId) params.append("topicId", topicId);

      const response = await axios.get(`/api/comments?${params.toString()}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, topicId]);

  useEffect(() => {
    if (chapterId || topicId) {
      fetchComments();
    }
  }, [fetchComments, chapterId, topicId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsPosting(true);
      await axios.post("/api/comments", {
        text: newComment,
        chapterId,
        topicId,
      });
      
      setNewComment("");
      toast.success("Comment posted!");
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditComment = async () => {
    if (!editText.trim() || !editingId) return;

    try {
      setIsEditing(true);
      await axios.patch(`/api/comments/${editingId}`, {
        text: editText,
      });
      
      toast.success("Comment updated");
      setEditingId(null);
      fetchComments();
    } catch (error) {
      console.error("Failed to update comment", error);
      toast.error("Failed to update comment");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/comments/${deletingId}`);
      
      toast.success("Comment deleted");
      setDeletingId(null);
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteComment();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {comments.length} Comment{comments.length !== 1 && "s"}
        </h3>
        <div className="flex gap-4">
            {/* Current user avatar could be passed here or fetched, using placeholder for now if needed */}
            <div className="flex-1 gap-2 flex flex-col">
                <Textarea 
                  placeholder="Add a comment..." 
                  className="min-h-[80px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isPosting}
                />
                <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={handlePostComment}
                      disabled={!newComment.trim() || isPosting}
                    >
                      {isPosting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Post Comment
                    </Button>
                </div>
            </div>
        </div>
      </div>
      
      <Separator />

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar>
                <AvatarImage src={comment.user.image || ""} alt={comment.user.name || "User"} />
                <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.user.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  {(currentUserId === comment.userId || isCurrentUserAdmin) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0   group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {currentUserId === comment.userId && (
                          <DropdownMenuItem onClick={() => startEditing(comment)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeletingId(comment.id)} className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[80px]"
                      disabled={isEditing}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={isEditing}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleEditComment} disabled={!editText.trim() || isEditing}>
                        {isEditing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.text}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
