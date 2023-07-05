import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Collection } from "../../types";
import { useFormFields } from "../../lib/hooks";

interface CollectionModalProps {
  cancel: () => void;
  handleSubmit: (data: CollectionFormData) => void;
}
interface CollectionFormData extends Omit<Collection, "createdAt"> {}
const CollectionModal = (props: CollectionModalProps) => {
  const modal = `w-fit h-full bg-white border border-[#eaeaea] hover:border-[#0070f3] shadow-2xl blur-none scale-100 ease-out duration-1000 justify-center align-center px-2 rounded-lg`;
  const title = `block uppercase tracking-wide text-slate-700 text-s font-bold mb-2`;
  const subTitle = `justify-center block uppercase tracking-wide text-slate-700 text-xs font-bold mb-2`;
  const label = `block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`;
  const input = `appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`;
  const borderStandard = `border border-gray-500`;
  const borderRequired = `border border-red-500`;
  const warningText = `text-red-500 text-xs italic`;

  const [fields, handleFieldChanged] = useFormFields<CollectionFormData>(
    {} as CollectionFormData
  );

  const [warnNameRequired, setWarnNameRequired] = useState(false);

  const validateForm = () => {
    return fields.name?.length > 0;
  };

  useEffect(() => {
    if (!validateForm()) {
      setWarnNameRequired(true);
      return;
    }
    setWarnNameRequired(false);
  }, [fields.name]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData: Omit<Collection, "createdAt"> = {
      name: fields.name,
      rooms: fields.rooms,
    };
    props.handleSubmit(fields);
  };
  return (
    <div className={modal}>
      <button onClick={props.cancel}>x</button>
      <h2 className="grid grid-cols-3 gap-1">
        <p></p>
        <p className={title}>Add a new Collection</p>
        <p></p>
      </h2>
      <form className="w-full max-w-lg" onSubmit={onSubmit}>
        <label className={label} htmlFor="name">
          Name
        </label>
        {warnNameRequired && (
          <p className={warningText}>Please enter a name for your Collection</p>
        )}

        <input
          className={input}
          id="name"
          type="text"
          value={fields.name}
          onChange={handleFieldChanged}
        />
        <input
          className={input}
          type="submit"
          value="Save"
          disabled={!validateForm()}
        />
      </form>
    </div>
  );
};

export default CollectionModal;
