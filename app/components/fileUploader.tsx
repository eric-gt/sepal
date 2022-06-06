import Image from "next/image";
import { useState, useEffect, useRef } from "react";
export default function FileUploader({ onFileSelect }) {
  const fileInput = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objUrl = URL.createObjectURL(selectedFile);
    setPreview(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [selectedFile]);

  const handleInput = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      //prevent previously selected images from being unloaded
      setSelectedFile(e.target.files[0]);
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="file-uploader max-h-14 max-w-14">
      <input
        type="file"
        accept=".jpg,.png,.jpeg"
        capture="environment"
        ref={fileInput}
        id="plant-file-input"
        onChange={handleInput}
        className="hidden"
      />
      <label htmlFor="plant-file-input">
        {preview && (
          <Image
            className="hover:cursor-pointer"
            alt="a lovely photo of your plant"
            src={preview}
            width="64px"
            height="64px"
          />
        )}
        {!preview && (
          <div>
            <div className="text-center border-dashed border-2 border-indigo-400 hover:border-indigo-600 hover:cursor-pointer rounded-lg w-14 h-14">
              <p className="mt-3 text-lg font-extrabold text-slate-400 hover:text-slate-600">
                +
              </p>
            </div>
            <p>Upload a picture of your plant!</p>
          </div>
        )}
      </label>
    </div>
  );
}
