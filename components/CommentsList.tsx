"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2, MoreVertical, Pencil, Trash, Reply } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  parentId?: string | null;
  user: {
    name: string | null;
    image: string | null;
    role: string;
  };
  replies?: Comment[];
}

interface CommentsListProps {
  chapterId?: string;
  topicId?: string;
  currentUserId?: string;
  isCurrentUserAdmin?: boolean;
}

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

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  currentUserId?: string;
  isCurrentUserAdmin?: boolean;
  editingId: string | null;
  startEditing: (comment: Comment) => void;
  cancelEditing: () => void;
  handleEditComment: () => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  setDeletingId: (id: string | null) => void;
  replyingId: string | null;
  setReplyingId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: (parentId: string) => void;
  isReplying: boolean;
}

const CommentItem = ({
  comment,
  isReply = false,
  currentUserId,
  isCurrentUserAdmin,
  editingId,
  startEditing,
  cancelEditing,
  handleEditComment,
  isEditing,
  editText,
  setEditText,
  setDeletingId,
  replyingId,
  setReplyingId,
  replyText,
  setReplyText,
  handleReply,
  isReplying,
}: CommentItemProps) => {
  return (
    <div className={`flex gap-4 group ${isReply ? "ml-12 mt-4" : "mt-6"}`}>
      <Avatar className={isReply ? "h-8 w-8" : "h-10 w-10"}>
        <AvatarImage
          src={comment.user.image || ""}
          alt={comment.user.name || "User"}
        />
        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.user.name || "Anonymous"}
            </span>
            {(comment.user.role === "ADMIN" ||
              comment.user.role === "SUPER_ADMIN") && (
              <Badge variant="default" className="text-[10px] px-1 py-0 h-5">
                {comment.user.role === "SUPER_ADMIN" ? "Admin" : "Mod"}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          {(currentUserId === comment.userId || isCurrentUserAdmin) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
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
                <DropdownMenuItem
                  onClick={() => setDeletingId(comment.id)}
                  className="text-red-600"
                >
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
              dir="auto"
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelEditing}
                disabled={isEditing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEditComment}
                disabled={!editText.trim() || isEditing}
              >
                {isEditing && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap" dir="auto">
              {comment.text}
            </p>

            {!isReply && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    if (replyingId === comment.id) {
                      setReplyingId(null);
                    } else {
                      setReplyingId(comment.id);
                      setReplyText("");
                    }
                  }}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            )}

            {replyingId === comment.id && (
              <div className="flex gap-2 items-start mt-2 animate-in fade-in slide-in-from-top-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px] text-sm"
                  disabled={isReplying}
                  autoFocus
                  dir="auto"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyText.trim() || isReplying}
                  >
                    {isReplying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reply"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReplyingId(null)}
                    disabled={isReplying}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentsList = ({
  chapterId,
  topicId,
  currentUserId,
  isCurrentUserAdmin,
}: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Pagination
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reply state
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchComments = useCallback(
    async (reset = false) => {
      try {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
          setIsLoading(true);
          setComments([]);
        } else {
          setIsLoadingMore(true);
        }

        const params = new URLSearchParams();
        if (chapterId) params.append("chapterId", chapterId);
        if (topicId) params.append("topicId", topicId);
        params.append("limit", LIMIT.toString());
        params.append("offset", currentOffset.toString());

        const response = await axios.get(`/api/comments?${params.toString()}`);

        if (response.data.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (reset) {
          setComments(response.data);
        } else {
          setComments((prev) => [...prev, ...response.data]);
        }

        setOffset(currentOffset + LIMIT);
      } catch (error) {
        console.error("Failed to fetch comments", error);
        toast.error("Failed to load comments");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [chapterId, topicId, offset]
  );

  // Initial load
  useEffect(() => {
    // Only fetch if offset is 0 to avoid double fetching on strict mode or re-renders
    // But we need to handle initial load.
    // Let's use a ref or just rely on useEffect with dependency on IDs
    if (chapterId || topicId) {
      // Reset and fetch
      setOffset(0);
      setHasMore(true);
      const params = new URLSearchParams();
      if (chapterId) params.append("chapterId", chapterId);
      if (topicId) params.append("topicId", topicId);
      params.append("limit", LIMIT.toString());
      params.append("offset", "0");

      setIsLoading(true);
      axios
        .get(`/api/comments?${params.toString()}`)
        .then((res) => {
          setComments(res.data);
          if (res.data.length < LIMIT) setHasMore(false);
          setOffset(LIMIT);
        })
        .catch((err) => toast.error("Failed to load comments"))
        .finally(() => setIsLoading(false));
    }
  }, [chapterId, topicId]);

  const loadMore = () => {
    fetchComments(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsPosting(true);
      const response = await axios.post("/api/comments", {
        text: newComment,
        chapterId,
        topicId,
      });

      setNewComment("");
      toast.success("Comment posted!");
      // Prepend new comment to list
      setComments((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      setIsReplying(true);
      const response = await axios.post("/api/comments", {
        text: replyText,
        chapterId,
        topicId,
        parentId,
      });

      toast.success("Reply posted!");
      setReplyText("");
      setReplyingId(null);

      // Update local state to show reply
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data],
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Failed to post reply", error);
      toast.error("Failed to post reply");
    } finally {
      setIsReplying(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setReplyingId(null); // Close reply if open
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

      // Update local state
      const updateCommentInTree = (list: Comment[]): Comment[] => {
        return list.map((c) => {
          if (c.id === editingId) {
            return { ...c, text: editText };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentInTree(c.replies) };
          }
          return c;
        });
      };

      setComments((prev) => updateCommentInTree(prev));
      setEditingId(null);
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

      // Update local state
      const deleteFromTree = (list: Comment[]): Comment[] => {
        return list
          .filter((c) => c.id !== deletingId)
          .map((c) => {
            if (c.replies) {
              return { ...c, replies: deleteFromTree(c.replies) };
            }
            return c;
          });
      };

      setComments((prev) => deleteFromTree(prev));
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
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
        <h3 className="font-semibold text-lg">Comments</h3>
        <div className="flex gap-4">
          <div className="flex-1 gap-2 flex flex-col">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[80px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
              dir="auto"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handlePostComment}
                disabled={!newComment.trim() || isPosting}
              >
                {isPosting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
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
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserId}
                  isCurrentUserAdmin={isCurrentUserAdmin}
                  editingId={editingId}
                  startEditing={startEditing}
                  cancelEditing={cancelEditing}
                  handleEditComment={handleEditComment}
                  isEditing={isEditing}
                  editText={editText}
                  setEditText={setEditText}
                  setDeletingId={setDeletingId}
                  replyingId={replyingId}
                  setReplyingId={setReplyingId}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleReply={handleReply}
                  isReplying={isReplying}
                />
                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                    {comment.replies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        isReply
                        currentUserId={currentUserId}
                        isCurrentUserAdmin={isCurrentUserAdmin}
                        editingId={editingId}
                        startEditing={startEditing}
                        cancelEditing={cancelEditing}
                        handleEditComment={handleEditComment}
                        isEditing={isEditing}
                        editText={editText}
                        setEditText={setEditText}
                        setDeletingId={setDeletingId}
                        replyingId={replyingId}
                        setReplyingId={setReplyingId}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleReply={handleReply}
                        isReplying={isReplying}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
