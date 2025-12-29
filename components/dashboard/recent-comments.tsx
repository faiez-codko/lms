"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface CommentUser {
  name: string | null;
  image: string | null;
  email: string | null;
}

interface CommentEntity {
  id: string;
  text: string;
  createdAt: Date;
  parentId: string | null;
  userId: string;
  chapterId: string | null;
  topicId: string | null;
  user: CommentUser;
  chapter?: {
    id: string;
    title: string;
    courseId: string;
  } | null;
  topic?: {
    id: string;
    title: string;
    chapterId: string;
    chapter: {
      id: string;
      courseId: string;
    };
  } | null;
}

interface RecentCommentsProps {
  comments: CommentEntity[];
}

export const RecentComments = ({ comments }: RecentCommentsProps) => {
  return (
    <div className="bg-background rounded-xl p-6 border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Comments</h3>
        {/* <button className="text-sm text-primary hover:underline">Moderate all</button> */}
      </div>

      <div className="space-y-3">
        {comments.length === 0 && (
           <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
        {comments.map((comment) => {
          const isReply = !!comment.parentId;
          const articleTitle = comment.chapter?.title || comment.topic?.title || "Unknown";
          
          let link = "#";
          if (comment.chapter) {
             link = `/courses/${comment.chapter.courseId}/chapters/${comment.chapter.id}`;
          } else if (comment.topic) {
             link = `/courses/${comment.topic.chapter.courseId}/chapters/${comment.topic.chapter.id}/topics/${comment.topic.id}`;
          }

          return (
            <div
              key={comment.id}
              className="p-3 rounded-lg border transition-colors hover:bg-accent/50 border-border"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={comment.user.image || undefined} alt={comment.user.name || "User"} />
                  <AvatarFallback className="text-xs">
                    {comment.user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{comment.user.name || "User"}</span>
                      {isReply && (
                        <Badge variant="outline" className="text-xs">
                          Reply
                        </Badge>
                      )}
                      {/* Status badge placeholder if needed */}
                      {/* <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">approved</Badge> */}
                    </div>
                    {/* <button className="p-1 hover:bg-accent rounded">
                      <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                    </button> */}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{comment.text}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span>on <Link href={link} className="font-medium hover:text-primary hover:underline">"{articleTitle}"</Link></span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons placeholder */}
                  {/* <div className="flex items-center space-x-2 mt-2">
                     <div className="flex items-center space-x-1">
                        <button className="text-green-600 hover:text-green-700 font-medium text-xs">Approve</button>
                        <button className="text-red-600 hover:text-red-700 font-medium text-xs">Reject</button>
                      </div>
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
