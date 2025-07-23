import React from "react";

interface PreviewImageProps {
  src: string | null;
  onClose: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt="preview"
          className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
        />
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 text-gray-700 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PreviewImage;
