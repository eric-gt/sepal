"use client";
import { ChangeEvent, ChangeEventHandler, Ref, useRef } from "react";

type FileSelectHandler = {
  onFileSelect: (file: File) => void;
};
export default function FileUploader({ onFileSelect }: FileSelectHandler) {
  const fileInput: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target?.files) {
      const file = e.target.files[0];
      await onFileSelect(file);
    }
  };
  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileUpload} />
      <button onClick={(e) => fileInput.current && fileInput.current.click()} />
    </div>
  );
}
