import { useRef } from "react";
export default function FileUploader({onFileSelect}) {
    const fileInput = useRef(null)

    const handleInput = (e) => {
        e.preventDefault();
        onFileSelect(e.target.files[0])
    }

    return(
        <div className="file-uploader">
            <input type="file" onChange={handleInput} />
            <button onClick={e => fileInput.current && fileInput.current.click()} />
        </div>
    )
}