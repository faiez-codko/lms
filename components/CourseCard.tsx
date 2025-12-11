import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, User } from "lucide-react";

interface CourseProps {
  title: string;
  author: string;
  thumbnail: string;
  price: string;
  rating: number;
  students: number;
  category: string;
}

export const CourseCard = ({ course }: { course: CourseProps }) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card p-0 pb-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
            {/* <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                12:45
            </span> */}
        </div>
      </div>
      <CardContent >
        <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {course.title}
            </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="h-3 w-3" />
          <span>{course.author}</span>
        </div>

        <div className="flex items-center gap-1 mb-2">
            <span className="font-bold text-sm">{course.rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
        </div>
        
        <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full w-fit">
            {course.category}
        </div>
      </CardContent>
    </Card>
  );
};
