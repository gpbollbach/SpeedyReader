import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

interface WPMCarouselProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function WPMCarousel({
  value,
  onChange,
  min = 20,
  max = 300,
  step = 5
}: WPMCarouselProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate values for the carousel
  const values: number[] = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }
  
  const currentIndex = values.findIndex(v => v === currentValue);
  
  // Sync internal state when value prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue, onChange]);

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentValue(values[newIndex]);
  };

  const handleNext = () => {
    const newIndex = Math.min(values.length - 1, currentIndex + 1);
    setCurrentValue(values[newIndex]);
  };

  const handleQuickAdjust = (adjustment: number) => {
    const newValue = Math.max(min, Math.min(max, currentValue + adjustment));
    setCurrentValue(newValue);
  };

  // Touch handling for swipe gestures
  const [startX, setStartX] = useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        handleNext(); // Swipe left = next
      } else {
        handlePrevious(); // Swipe right = previous
      }
    }
    
    setStartX(null);
  };

  // Get visible values (current and neighbors)
  const getVisibleValues = () => {
    const visibleValues = [];
    const visibleRange = 2; // Show 2 values on each side
    
    for (let i = currentIndex - visibleRange; i <= currentIndex + visibleRange; i++) {
      if (i >= 0 && i < values.length) {
        visibleValues.push({
          value: values[i],
          index: i,
          isCenter: i === currentIndex
        });
      }
    }
    
    return visibleValues;
  };

  const visibleValues = getVisibleValues();

  return (
    <div className="space-y-4">
      {/* Quick adjustment buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleQuickAdjust(-10)}
          data-testid="button-wpm-minus-10"
        >
          <Minus className="w-4 h-4 mr-1" />
          10
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleQuickAdjust(-1)}
          data-testid="button-wpm-minus-1"
        >
          <Minus className="w-4 h-4 mr-1" />
          1
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleQuickAdjust(1)}
          data-testid="button-wpm-plus-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          1
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleQuickAdjust(10)}
          data-testid="button-wpm-plus-10"
        >
          <Plus className="w-4 h-4 mr-1" />
          10
        </Button>
      </div>

      {/* Main carousel */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            data-testid="button-wpm-previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div
            ref={containerRef}
            className="flex-1 mx-4 relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            data-testid="carousel-wpm-container"
          >
            <div className="flex items-center justify-center min-h-[120px]">
              {visibleValues.map(({ value: val, index, isCenter }) => (
                <div
                  key={index}
                  className={`flex-shrink-0 transition-all duration-300 cursor-pointer mx-2 ${
                    isCenter 
                      ? 'text-4xl font-bold text-primary scale-110' 
                      : 'text-2xl text-muted-foreground scale-90'
                  }`}
                  onClick={() => setCurrentValue(val)}
                  data-testid={`wpm-value-${val}`}
                >
                  <div className="text-center">
                    <div>{val}</div>
                    {isCenter && (
                      <div className="text-xs font-normal text-muted-foreground mt-1">
                        WPM
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Center indicator line */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-primary opacity-30"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === values.length - 1}
            data-testid="button-wpm-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Value display and range info */}
      <div className="text-center space-y-1">
        <div className="text-sm text-muted-foreground">
          Range: {min} - {max} WPM
        </div>
        <div className="text-xs text-muted-foreground">
          Swipe horizontally or use buttons to adjust
        </div>
      </div>
    </div>
  );
}