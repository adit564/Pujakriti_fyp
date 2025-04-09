import React, { useState, useEffect, useRef } from 'react';
import '../../app/styles/carousel.css'; 

interface CarouselItem {
  id: number;
  videoUrl: string;
  title: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  blurIntensity?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlayInterval = 5000,
  blurIntensity = 8 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const bgVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  

  // Initialize ref arrays
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, items.length);
    bgVideoRefs.current = bgVideoRefs.current.slice(0, items.length);
  }, [items]);

  // Handle auto-play
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, autoPlayInterval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPlaying, autoPlayInterval]);

  // Handle video playback when index changes
  useEffect(() => {
    const playCurrentVideos = async () => {

      // Play current videos
      try {
        if (videoRefs.current[currentIndex]) {
          await videoRefs.current[currentIndex]?.play();
        }
        if (bgVideoRefs.current[currentIndex]) {
          await bgVideoRefs.current[currentIndex]?.play();
        }
      } catch (err) {
        console.error('Error playing video:', err);
      }
    };

    playCurrentVideos();
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), autoPlayInterval);
  };

  return (
    <div className="carousel-container">
      {/* Video background - same videos but blurred */}
      <div className="carousel-background">
        {items.map((item, index) => (
          <video
            key={`bg-${item.id}`}
            ref={(el) => {
              bgVideoRefs.current[index] = el;
            }}
            src={item.videoUrl}
            muted
            loop
            playsInline
            className={`background-video ${index === currentIndex ? 'active' : ''}`}
            style={{ filter: `blur(${blurIntensity}px)` }}
          />
        ))}
      </div>

      {/* Main carousel content */}
      <div className="carousel-content">
        {/* <button className="nav-button left" onClick={goToPrev}>
          &lt;
        </button> */}

        <div className="carousel-items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={item.videoUrl}
                muted
                loop
                playsInline
                className="carousel-video"
              />
              <div className="carousel-caption">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* <button className="nav-button right" onClick={goToNext}>
          &gt;
        </button> */}
      </div>

      {/* Navigation dots */}
      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={`dot-${index}`}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;