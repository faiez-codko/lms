import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const comments = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20developer%20portrait&image_size=square",
    date: "2 days ago",
    content: "This explanation of Prisma schemas really clicked for me! I've been struggling with relations for a while. Thanks!",
    likes: 12,
  },
  {
    id: 2,
    author: "Michael Ross",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=man%20developer%20portrait&image_size=square",
    date: "5 days ago",
    content: "Can you please clarify the difference between implicit and explicit many-to-many relations again?",
    likes: 4,
  },
  {
    id: 3,
    author: "Jessica Lee",
    avatar: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=woman%20coder%20portrait&image_size=square",
    date: "1 week ago",
    content: "Great video! The audio quality is much better in this one.",
    likes: 2,
  }
];

export const CommentsList = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">3 Comments</h3>
        <div className="flex gap-4">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 gap-2 flex flex-col">
                <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                <div className="flex justify-end">
                    <Button size="sm">Post Comment</Button>
                </div>
            </div>
        </div>
      </div>
      
      <Separator />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.avatar} alt={comment.author} />
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="text-xs text-muted-foreground hover:text-primary font-medium">Reply</button>
                <button className="text-xs text-muted-foreground hover:text-primary font-medium">Like ({comment.likes})</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
