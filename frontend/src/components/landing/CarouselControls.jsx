import React from 'react';

/**
 * CarouselControls
 * Provides transparent, accessible click areas over the left and right arrows
 * already illustrated inside the slide graphics. Removes duplicate floating arrow overlays.
 */
export const CarouselControls = ({ onPrev, onNext }) => {
  return (
    <>
      {/* Invisible Click Target Area Over Left Arrow in Photo */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous slide"
        title="Previous Slide"
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-30 flex items-center justify-start pl-2 sm:pl-4 cursor-pointer group focus:outline-none"
      >
        <span className="sr-only">Previous Slide</span>
      </button>

      {/* Invisible Click Target Area Over Right Arrow in Photo */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next slide"
        title="Next Slide"
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-30 flex items-center justify-end pr-2 sm:pr-4 cursor-pointer group focus:outline-none"
      >
        <span className="sr-only">Next Slide</span>
      </button>
    </>
  );
};
