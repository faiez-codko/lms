import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";

interface CourseQuizCardProps {
    courseId: string;
    chapterId: string;
    quizId: string;
    title: string;
}

export const CourseQuizCard = ({
    courseId,
    chapterId,
    quizId,
    title
}: CourseQuizCardProps) => {
    return (
        <div className="bg-sky-50 border border-sky-100 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-sky-900 mb-2 flex items-center gap-x-2">
                <BrainCircuit className="h-5 w-5" />
                Quiz Available
            </h3>
            <p className="text-sm text-sky-700 mb-4">
                Test your knowledge with the "{title}" quiz.
            </p>
            <Link href={`/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}`}>
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    Start Quiz
                </Button>
            </Link>
        </div>
    )
}
