import { useEffect, useRef, useState } from "react";
import DamageOverlay from "../DamageOverlay";

function ImageFrame({ image }) {
  const frameRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!image?.dimensions) {
      console.warn('Image or dimensions missing:', image);
      return;
    }

    const frame = frameRef.current;
    if (!frame) {
      console.warn('Frame ref not available');
      return;
    }

    const updateFrameDimensions = () => {
      const container = frame.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imageAspect = image.dimensions.width / image.dimensions.height;
      const containerAspect = containerWidth / containerHeight;

      let frameWidth, frameHeight;

      if (containerAspect > imageAspect) {
        frameHeight = Math.min(containerHeight, image.dimensions.height);
        frameWidth = frameHeight * imageAspect;
      } else {
        frameWidth = Math.min(containerWidth, image.dimensions.width);
        frameHeight = frameWidth / imageAspect;
      }

      setDimensions({ width: frameWidth, height: frameHeight });
    };

    const resizeObserver = new ResizeObserver(updateFrameDimensions);
    resizeObserver.observe(frame.parentElement);
    updateFrameDimensions();

    return () => resizeObserver.disconnect();
  }, [image]);

  if (!image?.dimensions) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>Loading image...</p>
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className="relative"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <img
        src={image.imageUrl}
        alt="Vehicle damage"
        className="w-full h-full object-contain"
      />
      <DamageOverlay
        damageInfo={image.damageInfo}
        imageDimensions={image.dimensions}
        frameDimensions={dimensions}
      />
    </div>
  );
}

export default ImageFrame;