import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";

const courses = [
  {
    id: 1,
    title: "Complete React.js Masterclass 2024",
    author: "Code With Faiez",
    thumbnail: "https://utfs.io/f/7696b4d9-c2fe-4436-a4f6-c4cf83661223-6rrk66.png",
    price: "$19.99",
    rating: 4.8,
    students: 12500,
    category: "Development"
  },
  {
    id: 2,
    title: "Next.js 14: The Full Stack Guide",
    author: "Web Dev Simplified",
    thumbnail: "https://utfs.io/f/6acb8a34-0353-48f7-af9d-4769006758a3-m2s61f.png",
    price: "$24.99",
    rating: 4.9,
    students: 8300,
    category: "Web Development"
  },
  {
    id: 3,
    title: "Advanced Tailwind CSS Patterns",
    author: "UI Labs",
    thumbnail: "https://utfs.io/f/539a30f8-2ecd-45b3-aa68-ebbc83f236f9-36lslp.png",
    price: "$14.99",
    rating: 4.7,
    students: 5400,
    category: "Design"
  },
  {
    id: 4,
    title: "TypeScript for Absolute Beginners",
    author: "Tech Academy",
    thumbnail: "https://utfs.io/f/83c527ed-6039-4656-8f55-8f860ede157f-5wfqy3.png",
    price: "Free",
    rating: 4.6,
    students: 22000,
    category: "Development"
  },
  {
    id: 5,
    title: "Node.js & Express: Backend Zero to Hero",
    author: "Backend Masters",
    thumbnail: "https://utfs.io/f/7719234a-5290-48f9-80e3-5d1a38951698-1j.jpg",
    price: "$29.99",
    rating: 4.8,
    students: 9100,
    category: "Backend"
  },
  {
    id: 6,
    title: "Python for Data Science Bootcamp",
    author: "Data Wizards",
    thumbnail: "https://utfs.io/f/3c61a539-19c6-4acf-9dca-ff47541c5812-o0wya.png",
    price: "$34.99",
    rating: 4.9,
    students: 15600,
    category: "Data Science"
  },
  {
    id: 7,
    title: "Machine Learning A-Z",
    author: "AI Research",
    thumbnail: "https://utfs.io/f/639978a4-f9e8-402d-ad9e-3f7921ff0efb-8goos1.png",
    price: "$39.99",
    rating: 4.7,
    students: 7800,
    category: "AI"
  },
  {
    id: 8,
    title: "Modern UI/UX Design Principles",
    author: "Design School",
    thumbnail: "https://utfs.io/f/0a80a056-c4b7-47fd-942c-c09e7f50593d-1vu9za.png",
    price: "$19.99",
    rating: 4.8,
    students: 6200,
    category: "Design"
  }
];

const categories = [{
  id: 1,
  name: "All",
  isActive: true,
}, {
  id: 2,
  name: "Development",
  isActive: false,
}, {
  id: 3,
  name: "Design",
  isActive: false,
}, {
  id: 4,
  name: "Business",
  isActive: false,
}];

export default function Home() {

  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap">
          <h1 className="text-2xl font-bold">Recommended for you</h1>
          <div className="flex gap-2 mt-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 ${category.isActive ? "bg-gray-100 dark:bg-gray-900" : "bg-white dark:bg-gray-600"} border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 ${category.isActive ? "bg-gray-100 dark:bg-gray-800" : ""}`}
              >
                {category.name}
              </button>
            ))}
           </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...courses , ...courses].map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
             <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}
