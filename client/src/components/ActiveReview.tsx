import { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Student } from "@shared/schema";
import { Check, X, BookOpen, Play, Pause, RotateCcw } from "lucide-react";

interface TextExample {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

const SAMPLE_TEXTS: TextExample[] = [
  {
    id: "1",
    title: "The Quick Fox",
    content: "The quick brown fox jumps over the lazy dog.",
    wordCount: 9,
  },
  {
    id: "2",
    title: "Summer Day",
    content: "A bright yellow sun shines over the green meadow during a warm summer day.",
    wordCount: 14,
  },
  {
    id: "3",
    title: "The Ocean",
    content: "Deep blue waves crash against the rocky shore while seagulls fly high in the salty air.",
    wordCount: 16,
  },
  {
    id: "4",
    title: "Forest Life",
    content: "Small birds chirp loudly in the tall trees as a tiny squirrel gathers nuts for winter.",
    wordCount: 16,
  },
  {
    id: "5",
    title: "Starry Night",
    content: "Twinkling stars fill the dark night sky while a silver moon glows softly behind the clouds.",
    wordCount: 16,
  },
];

interface ActiveReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onSubmit: (data: { studentId: string; wordsPerMinute: number; testDate: Date }) => void;
}

export function ActiveReview({ open, onOpenChange, student, onSubmit }: ActiveReviewProps) {
  const [selectedText, setSelectedText] = useState<TextExample | null>(null);
  const [markedIndices, setMarkedIndices] = useState<Set<number>>(new Set());
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when text changes or dialog opens/closes
  useEffect(() => {
    if (!open) {
      stopTimer();
      resetTimer();
      setMarkedIndices(new Set());
    }
  }, [open]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const startTimer = () => setIsActive(true);
  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(60);
    setElapsedSeconds(0);
    setMarkedIndices(new Set());
  };

  const words = useMemo(() => {
    if (!selectedText) return [];
    return selectedText.content.split(/\s+/);
  }, [selectedText]);

  const correctCount = markedIndices.size;
  
  const currentWPM = useMemo(() => {
    if (elapsedSeconds === 0) return 0;
    return Math.round((correctCount / elapsedSeconds) * 60);
  }, [correctCount, elapsedSeconds]);

  const toggleWord = (index: number) => {
    // Only allow marking if timer is running or has been started
    if (elapsedSeconds === 0 && !isActive) return;
    
    const newIndices = new Set(markedIndices);
    if (newIndices.has(index)) {
      newIndices.delete(index);
    } else {
      newIndices.add(index);
    }
    setMarkedIndices(newIndices);
  };

  const handleSave = () => {
    if (!selectedText) return;
    
    onSubmit({
      studentId: student.id,
      wordsPerMinute: currentWPM,
      testDate: new Date(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle>Active Review: {student.name}</DialogTitle>
              {selectedText && (
                <p className="text-sm text-muted-foreground">
                  Text: {selectedText.title} ({selectedText.wordCount} words)
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-muted/30 p-1 rounded-lg border gap-1">
                {!isActive ? (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={startTimer}
                    disabled={!selectedText || timeLeft === 0}
                    className="h-8 px-3"
                  >
                    <Play className="w-3 h-3 mr-2 fill-current" />
                    {elapsedSeconds > 0 ? "Resume" : "Start"}
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={stopTimer}
                    className="h-8 px-3"
                  >
                    <Pause className="w-3 h-3 mr-2 fill-current" />
                    Pause
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={resetTimer}
                  disabled={!selectedText || elapsedSeconds === 0}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex items-center gap-6 px-4 border-l">
                <div className="text-center">
                  <div className="text-xl font-mono font-bold tabular-nums">
                    00:{timeLeft.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase text-muted-foreground font-semibold">Time</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-primary tabular-nums">
                    {currentWPM}
                  </div>
                  <div className="text-[9px] uppercase text-muted-foreground font-semibold">WPM</div>
                </div>

                <div className="flex flex-col items-center">
                  <Badge variant="outline" className="text-sm py-0 px-2">
                    {correctCount} / {selectedText?.wordCount || 0}
                  </Badge>
                  <div className="text-[9px] uppercase text-muted-foreground font-semibold mt-1">Words</div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Master: Text List */}
          <div className="w-1/3 border-r bg-muted/20">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Select a Text
                </h3>
                {SAMPLE_TEXTS.map((text) => (
                  <button
                    key={text.id}
                    onClick={() => {
                      setSelectedText(text);
                      resetTimer();
                    }}
                    className={`w-full text-left p-3 rounded-md transition-colors hover:bg-accent/50 ${
                      selectedText?.id === text.id ? "bg-accent shadow-sm" : ""
                    }`}
                  >
                    <div className="font-medium">{text.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {text.wordCount} words
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detail: Text View & Marking */}
          <div className="flex-1 flex flex-col bg-background">
            <ScrollArea className="flex-1 p-8">
              {selectedText ? (
                <div className="max-w-2xl mx-auto">
                  {!isActive && elapsedSeconds > 0 && (
                    <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-1">Current Progress</p>
                      <p className="text-3xl font-bold text-primary">
                        {correctCount} words correctly read
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Calculated speed: {currentWPM} WPM
                      </p>
                    </div>
                  )}
                  <div className={`flex flex-wrap gap-2 text-2xl leading-relaxed transition-all duration-300 ${!isActive && elapsedSeconds === 0 ? "opacity-50 blur-[1px]" : "opacity-100"}`}>
                    {words.map((word, index) => (
                      <span
                        key={index}
                        onClick={() => toggleWord(index)}
                        className={`cursor-pointer px-1.5 py-0.5 rounded transition-all select-none ${
                          markedIndices.has(index)
                            ? "bg-primary text-primary-foreground font-medium scale-105 shadow-sm"
                            : "hover:bg-muted"
                        } ${!isActive && elapsedSeconds > 0 ? "pointer-events-none opacity-80" : ""}`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  {!isActive && elapsedSeconds === 0 && (
                    <p className="text-center mt-12 text-muted-foreground animate-pulse">
                      Click "Start" to begin the assessment
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                  <p>Select a text from the left to begin the review</p>
                </div>
              )}
            </ScrollArea>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-muted/10 flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!selectedText || markedIndices.size === 0}
                className="min-w-[120px]"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Result
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
