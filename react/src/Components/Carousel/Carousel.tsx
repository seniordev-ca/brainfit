import { useState } from 'react';
import './Carousel.scss';


export interface CarouselProps {
  id: string;
  disableState?: boolean;
  carouselClass?: string;
  carouselItemClass?: string;
  children?: React.ReactNode;
  carouselItems: React.ReactElement[];
  onNext?: Function;
  onPrevious?: Function;
  // Custom template to be used for the indicators
  customIndicatorTemplate?: Function;
}

export const Carousel = ({
  carouselItems = [],
  carouselClass = '',
  carouselItemClass = '',
  ...props
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  function handleTouchStart(e: any) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: any) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStart - touchEnd > 150) {
      console.log('swiped left');
      if (canMove('next')) next();
    }

    if (touchStart - touchEnd < -150) {
      if (canMove('prev')) previous();
    }
  }

  const canMove = (direction: 'next' | 'prev') => {
    if (carouselItems && carouselItems.length !== 0) {
      if (direction === 'prev' && currentIndex === 0) return false;
      if (direction === 'next' && currentIndex === carouselItems.length - 1) return false;

      // No issues found - carousel can move
      return true
    }
    return false;
  };

  const next = () => {
    if (currentIndex < carouselItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (props.onNext) props.onNext(currentIndex + 1);
    }
  }

  const previous = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(prev => prev - 1);
    }
    if (props.onPrevious) props.onPrevious(currentIndex - 1);
  }

  return (
    <div id={props.id} className={["carousel slide carousel-fade relative", carouselClass].join(' ')} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Carousel inner */}
      <div className="carousel-inner">
        {carouselItems.map((row: any, i: number) => {
          return (
            <div key={`carousel-item-${i + 1}`} className={["carousel-item", carouselItemClass, currentIndex === i ? 'active' : ''].join(' ')}>
              {row}
            </div>
          )
        })}
      </div>
      {/* Carousel indicators */}
      <div className="carousel-indicators">
        {carouselItems.map((row: any, i: number) => {
          // if (props.customIndicatorTemplate) return props.customIndicatorTemplate(setCurrentIndex, row);
          return (
            <button key={`carousel-indicator-${i + 1}`} className="carousel-indicator" type="button" onClick={() => setCurrentIndex(i)} ></button>
          );
        })}
      </div>
      {/* Carousel controls */}
      {(canMove('prev')) ? (
        <button type="button" className="carousel-control group left-2 flex" onClick={previous}>
          <span className="control-item">
            <svg className="w-5 h-5 text-white shadow-md sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="hidden">Previous</span>
          </span>
        </button>
      ) : ''}

      {canMove('next') ? (
        <button placeholder='test' type="button" className={["carousel-control group right-2 ", currentIndex === carouselItems.length - 1 ? 'hidden' : 'flex'].join(' ')} onClick={next} >
          <span className="control-item">
            <svg className="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="hidden">Next</span>
          </span>
        </button>
      ) : ''}

    </div>
  );
};

