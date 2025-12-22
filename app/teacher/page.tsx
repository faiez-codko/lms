import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/actions/get-analytics";
import { Chart } from "@/components/dashboard/chart";
import { db } from "@/lib/prismadb";

const comments = [
    {
        user: "Alice Johnson",
        course: "Advanced React Patterns",
        comment: "This course completely changed how I write components. Highly recommended!",
        date: "2 hours ago"
    },
    {
        user: "Bob Smith",
        course: "Technical Analysis 101",
        comment: "Great introduction, but I wish there were more live examples.",
        date: "5 hours ago"
    },
    {
        user: "Charlie Brown",
        course: "Understanding Blockchain",
        comment: "Very clear explanation of complex topics.",
        date: "1 day ago"
    }
]

export const dynamic = "force-dynamic";

export default async function TeacherDashboard() {
  const session = await getCurrentUser();

  if (!session?.id) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(session.id);

  // Fetch active courses count
  const activeCoursesCount = await db.course.count({
    where: {
        userId: session.id,
        isPublished: true,
    }
  });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your course sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total successful enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoursesCount}</div>
            <p className="text-xs text-muted-foreground">
              Courses currently published
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart data={data} />
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex flex-col gap-1 border-b last:border-0 pb-3 last:pb-0">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">{comment.user}</span>
                                <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <span className="text-xs text-emerald-600 font-medium">{comment.course}</span>
                            <p className="text-sm text-slate-600 dark:text-slate-300">"{comment.comment}"</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
