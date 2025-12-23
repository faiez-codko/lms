"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface QuizPlayerProps {
  quiz: {
    id: string;
    title: string;
    questions: {
      id: string;
      text: string;
      imageUrl: string | null;
      options: {
        id: string;
        text: string;
        isCorrect: boolean;
      }[];
    }[];
  };
  courseId: string;
  chapterId: string;
}

export const QuizPlayer = ({
  quiz,
  courseId,
  chapterId
}: QuizPlayerProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    
    quiz.questions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find((opt) => opt.isCorrect);
      
      if (selectedOptionId === correctOption?.id) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
    toast.success("Quiz completed!");
  };

  const handleRetry = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  const handleExit = () => {
    router.push(`/courses/${courseId}/chapters/${chapterId}`);
  };

  if (isSubmitted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto p-6">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl font-bold text-sky-700">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                You scored {score} out of {totalQuestions}
              </p>
            </div>
            
            <Progress value={percentage} className="w-full h-4" />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review</h3>
              {quiz.questions.map((question, index) => {
                const selectedOptionId = answers[question.id];
                const correctOption = question.options.find((opt) => opt.isCorrect);
                const isCorrect = selectedOptionId === correctOption?.id;

                return (
                  <div key={question.id} className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="font-medium text-muted-foreground">{index + 1}.</span>
                      <p className="font-medium">{question.text}</p>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      {question.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isThisCorrect = option.isCorrect;
                        
                        let optionClass = "p-2 rounded-md border text-sm flex items-center justify-between";
                        
                        if (isThisCorrect) {
                            optionClass += " bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400";
                        } else if (isSelected && !isThisCorrect) {
                            optionClass += " bg-rose-100 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400";
                        } else {
                            optionClass += " bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800";
                        }

                        return (
                          <div key={option.id} className={optionClass}>
                            <span>{option.text}</span>
                            {isThisCorrect && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                            {isSelected && !isThisCorrect && <XCircle className="h-4 w-4 text-rose-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleExit}>
              Back to Lesson
            </Button>
            <Button onClick={handleRetry} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleExit} className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson
        </Button>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">{currentQuestion.text}</h2>
            {currentQuestion.imageUrl && (
              <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question" 
                    className="object-contain w-full h-full"
                />
              </div>
            )}
          </div>

          <RadioGroup 
            value={answers[currentQuestion.id] || ""} 
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className={cn(
                "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition dark:hover:bg-slate-900",
                answers[currentQuestion.id] === option.id && "border-sky-500 bg-sky-50 dark:bg-sky-900/10 dark:border-sky-800"
              )}>
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal text-base">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t">
          <Button 
            variant="ghost" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button 
                onClick={handleSubmit} 
                disabled={Object.keys(answers).length !== totalQuestions}
            >
                Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
