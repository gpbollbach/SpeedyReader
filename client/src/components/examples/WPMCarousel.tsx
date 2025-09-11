import { useState } from 'react';
import WPMCarousel from '../WPMCarousel';

export default function WPMCarouselExample() {
  const [wpm, setWpm] = useState(125);

  return (
    <div className="p-4 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reading Speed Selection</h3>
        <WPMCarousel
          value={wpm}
          onChange={(value) => {
            setWpm(value);
            console.log('WPM changed to:', value);
          }}
          min={30}
          max={250}
          step={5}
        />
        <div className="text-center text-sm text-muted-foreground">
          Selected: <strong>{wpm} WPM</strong>
        </div>
      </div>
    </div>
  );
}