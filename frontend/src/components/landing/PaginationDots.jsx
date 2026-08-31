import React from 'react';

/**
 * PaginationDots
 * Renders transparent click targets over the bottom pagination dots
 * illustrated in the slide graphics. Allows 1-click jump without visual duplication.
 */
export const PaginationDots = ({
  totalSlides,
  currentIndex,
  onSelectSlide,
  isPlaying,
  onTogglePlay
}) => {
  return (
    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-3 sm:gap-4 py-2 px-6">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? 'true' : 'false'}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer focus:outline-none flex items-center justify-center"
            title={`Slide ${index + 1}`}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        );
      })}

      {/* Screen reader semantic counter */}
      <span className="sr-only">
        Current Slide: {currentIndex + 1} of {totalSlides}
      </span>
    </div>
  );
};
