import { useState, useMemo, useEffect } from "react";
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
import { Check, X, BookOpen } from "lucide-react";

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
  const [startTime, setStartTime] = useState<number | null>(null);

  // Reset state when text changes or dialog opens
  useEffect(() => {
    if (open) {
      setMarkedIndices(new Set());
      setStartTime(Date.now());
    }
  }, [open, selectedText]);

  const words = useMemo(() => {
    if (!selectedText) return [];
    return selectedText.content.split(/\s+/);
  }, [selectedText]);

  const correctCount = markedIndices.size;

  const toggleWord = (index: number) => {
    const newIndices = new Set(markedIndices);
    if (newIndices.has(index)) {
      newIndices.delete(index);
    } else {
      newIndices.add(index);
    }
    setMarkedIndices(newIndices);
  };

  const handleSave = () => {
    if (!selectedText || !startTime) return;
    
    const durationMinutes = (Date.now() - startTime) / 60000;
    // For a simple live test, we assume the teacher stops the timer when reading is done.
    // If duration is too small, default to 1 minute for safety in calculation.
    const effectiveDuration = Math.max(durationMinutes, 0.1); 
    const wpm = Math.round(correctCount / effectiveDuration);

    onSubmit({
      studentId: student.id,
      wordsPerMinute: wpm,
      testDate: new Date(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Active Review: {student.name}</DialogTitle>
            {selectedText && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg py-1 px-3">
                  {correctCount} / {selectedText.wordCount} words correct
                </Badge>
              </div>
            )}
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
                    onClick={() => setSelectedText(text)}
                    className={`w-full text-left p-3 rounded-md transition-colors hover:bg-accent/50 ${
                      selectedText?.id === text.id ? "bg-accent" : ""
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
                  <h2 className="text-2xl font-bold mb-6">{selectedText.title}</h2>
                  <div className="flex flex-wrap gap-2 text-xl leading-relaxed">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        onClick={() => toggleWord(index)}
                        className={`cursor-pointer px-1 rounded transition-colors ${
                          markedIndices.has(index)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
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
