import { FormEventHandler, useEffect, useState } from "react";
import { useFormFields } from "../../lib/hooks";
import { NewRoomData, Plant } from "../../types";

interface RoomModalProps {
  collectionId: string;
  cancel: () => void;
  handleSubmit: (data: NewRoomData) => void;
}
export default function RoomModal(props: RoomModalProps) {
  const modal = `w-fit h-full bg-white border border-[#eaeaea] hover:border-[#0070f3] shadow-2xl blur-none scale-100 ease-out duration-1000 justify-center align-center px-2 rounded-lg`;
  const title = `block uppercase tracking-wide text-slate-700 text-s font-bold mb-2`;
  const subTitle = `justify-center block uppercase tracking-wide text-slate-700 text-xs font-bold mb-2`;
  const label = `block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`;
  const input = `appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`;
  const borderStandard = `border border-gray-500`;
  const borderRequired = `border border-red-500`;
  const warningText = `text-red-500 text-xs italic`;
  const [fields, handleFieldsChanged] = useFormFields({
    name: "",
    lightDirection: "",
    lightIntensity: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [warnNameRequired, setWarnNameRequired] = useState(false);

  const validateForm = () => {
    return fields.name.length > 0;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!validateForm()) {
      setWarnNameRequired(true);
    } else {
      setWarnNameRequired(false);
    }
  }, [isLoaded, fields.name]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newRoom: NewRoomData = {
      collectionId: props.collectionId,
      name: fields.name,
      plants: [] as Plant[],
      lighting: {
        direction: fields.lightDirection,
        intensity: fields.lightIntensity,
      },
    };
    props.handleSubmit(newRoom);
  };
  return (
    <div className={modal}>
      <button onClick={props.cancel}>x</button>
      <h2 className="flex justify-center">
        <p className={title}>Add a new room</p>
      </h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={label} htmlFor="name">
            Name
          </label>
          {warnNameRequired && (
            <p className={warningText}>Please enter a name for your room</p>
          )}
          <input
            className={input}
            id="name"
            type="text"
            value={fields.name}
            onChange={handleFieldsChanged}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={label} htmlFor="lightDirection">
            Light - Direction
          </label>
          <input
            className={`${input} ${borderStandard}`}
            id="lightDirection"
            type="text"
            value={fields.lightDirection}
            onChange={handleFieldsChanged}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={label} htmlFor="lightIntensity">
            Light - Intensity
          </label>
          <input
            className={`${input} ${borderStandard}`}
            id="lightIntensity"
            type="text"
            value={fields.lightIntensity}
            onChange={handleFieldsChanged}
          />
        </div>
        <input
          className={input}
          type="submit"
          value="Submit"
          disabled={!validateForm()}
        />
      </form>
    </div>
  );
}
