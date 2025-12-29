import { db } from "@/lib/prismadb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, BookOpen, Users, GraduationCap } from "lucide-react";
import { getAdminAnalytics } from "@/actions/get-admin-analytics";
import { Chart } from "@/components/dashboard/chart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { RecentComments } from "@/components/dashboard/recent-comments";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  const totalUsers = await db.user.count({
    where: { role: "USER" }
  });

  const totalCourses = await db.course.count();
  
  const { data, totalRevenue, totalSales } = await getAdminAnalytics();

  const recentComments = await db.comment.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: true,
      chapter: {
        select: {
          id: true,
          title: true,
          courseId: true
        }
      },
      topic: {
        select: {
          id: true,
          title: true,
          chapterId: true,
          chapter: {
            select: {
              id: true,
              courseId: true
            }
          }
        }
      }
    }
  });

  const recentCourses = await db.course.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      category: true
    }
  });

  return {
    totalUsers,
    totalCourses,
    totalRevenue,
    totalSales,
    data,
    recentComments,
    recentCourses
  };
}

export default async function AdminDashboardPage() {
  const { 
    totalUsers, 
    totalCourses, 
    totalRevenue, 
    totalSales, 
    data,
    recentComments,
    recentCourses 
  } = await getAnalytics();

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <RecentComments comments={recentComments} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Recent Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {recentCourses.length === 0 && (
                <p className="text-sm text-muted-foreground">No courses created yet.</p>
              )}
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col gap-1">
                    <Link href={`/teacher/courses/${course.id}`} className="font-medium hover:underline">
                      {course.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(course.createdAt), "MMM d, yyyy")}
                      </span>
                      {course.category && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {course.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={course.isPublished ? "default" : "outline"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-sm font-medium">
                      {course.price ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(course.price) : "Free"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Chart data={data} />
    </div>
  );
}
