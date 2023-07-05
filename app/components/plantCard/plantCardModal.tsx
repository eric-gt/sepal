"use client";
import {
  useState,
  useEffect,
  FormEventHandler,
  ChangeEvent,
  SyntheticEvent,
  ReactEventHandler,
} from "react";
import * as uuid from "uuid";
import { FileUploader } from "../index";
import config from "../../lib/config";
import { Collection, Room } from "../../types";
import { Dropdown } from "flowbite-react";
import { s3Upload } from "../../lib/awsLib";

type PlantCardFormData = {
  id?: string;
  alert: boolean;
  attachment?: string;
  sciName?: string;
  nickname: string;
  instructions: {
    watering: string;
    light: {
      direction: string;
      intensity: string;
    };
  };
  collectionId?: string;
  roomId?: string;
  collectionName?: string;
  roomName?: string;
  roomLightingDirection?: string;
  roomLightingIntensity?: string;
};

export default function PlantCardModal(props: any) {
  const modal = `w-fit h-full bg-white border border-[#eaeaea] hover:border-[#0070f3] shadow-2xl blur-none scale-100 ease-out duration-1000 justify-center align-center px-2 rounded-lg`;
  const title = `block uppercase tracking-wide text-slate-700 text-s font-bold mb-2`;
  const subTitle = `justify-center block uppercase tracking-wide text-slate-700 text-xs font-bold mb-2`;
  const label = `block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`;
  const input = `appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`;
  const borderStandard = `border border-gray-500`;
  const borderRequired = `border border-red-500`;
  const warningText = `text-red-500 text-xs italic`;

  const [collections, setCollections] = useState([] as Collection[]);
  const [formData, setFormData] = useState<PlantCardFormData>({
    alert: false,
    sciName: "Monstera Deliciosa",
    nickname: "Frankenstein's Monstera",
    instructions: {
      watering: "Flood and Drain every 2 weeks. Mist leaves 2x weekly",
      light: {
        direction: "North",
        intensity: "indirect",
      },
    },
  });

  const [rooms, setRooms] = useState([] as Room[]);

  useEffect(() => {
    setCollections(props.collections);
  }, []);
  const handleFileSelect = async (file: File) => {
    if (file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000
        } MB`
      );
      return;
    }

    const value = await s3Upload(file);
    setFormData({ ...formData, attachment: value });
  };

  const validateForm = (): boolean | undefined => {
    return !formData.attachment ? false : true;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    const id = uuid.v4();
    e.preventDefault();
    props.handleSubmit({ ...formData, id });
  };

  const handleCollectionSelect = (id: string) => {
    const rooms =
      collections.find((collection) => collection.id === id)?.rooms ?? [];
    setRooms(rooms);
    setFormData({ ...formData, collectionId: id });
  };

  const handleRoomSelect = (id: string) => {
    setFormData({ ...formData, roomId: id });
  };

  const renderRooms = () => {
    return rooms?.map((room) => (
      <div
        key={room.id!}
        className="flex items-center p-2 rounded hover:b-gray-100 dark:hover:b-gray-600"
      >
        <Dropdown.Item
          onClick={() => handleRoomSelect(room.id!)}
          id={`dropdown-item-rooms-${room.id}`}
        >
          {room.name}
        </Dropdown.Item>
        <label htmlFor={`dropdown-item-rooms-${room.id}`}></label>
      </div>
    ));
  };
  const renderCollections = () => {
    return collections.map((collection) => (
      <div
        key={collection.id}
        className="flex items-center p-2 rounded hover:b-gray-100 dark:hover:b-gray-600"
      >
        <Dropdown.Item
          onClick={() => handleCollectionSelect(collection.id!)}
          id={`dropdown-item-collections-${collection.id}`}
        >
          {collection.name}
        </Dropdown.Item>
        <label htmlFor={`dropdown-item-collection-${collection.id}`}></label>
      </div>
    ));
  };
  const renderCollectionDropdowns = () => {
    return (
      <div className="my-2 grid grid-col-3 gap-1">
        <Dropdown label="Collection">{renderCollections()}</Dropdown>
        {rooms.length > 0 ? (
          <Dropdown label="Rooms">{renderRooms()}</Dropdown>
        ) : (
          renderNewRoomForm()
        )}
      </div>
    );
  };

  const renderNewRoomForm = () => {
    return (
      <div className="grid grid-col-3 gap-1">
        <label htmlFor="new-room-name">Room Name</label>
        <input
          id="new-room-name"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, roomName: e.target.value })
          }
        />
        <label htmlFor="new-room-lighting-direction">
          Room Light Direction
        </label>
        <input
          id="new-room-lighting-direction"
          type="text"
          onChange={(e) =>
            setFormData({
              ...formData,
              roomLightingDirection: e.target.value,
            })
          }
        />
        <label htmlFor="new-room-lighting-intensity">
          Room Light Intensity
        </label>
        <input
          id="new-room-lighting-intensity"
          type="text"
          onChange={(e) =>
            setFormData({
              ...formData,
              roomLightingIntensity: e.target.value,
            })
          }
        />
      </div>
    );
  };
  const renderNewCollectionForm = () => {
    return (
      <div className="flex flex-wrap">
        <label htmlFor="new-collection-name">Collection Name</label>
        <input
          id="new-collection-name"
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, collectionName: e.target.value })
          }
        />
        {renderNewRoomForm()}
      </div>
    );
  };
  return (
    <div className={modal}>
      <button onClick={props.cancel}>x</button>
      <h2 className="grid grid-cols-3 gap-1">
        <p></p>
        <p className={title}>Add a new plant</p>
        <p></p>
      </h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {collections.length > 0
          ? renderCollectionDropdowns()
          : renderNewCollectionForm()}
        <FileUploader onFileSelect={handleFileSelect} />
        <h2 className="grid grid-cols-3 gap-1">
          <p></p>
          <p className={subTitle}>General Info</p>
          <p></p>
        </h2>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={label} htmlFor="grid-sci-name">
              Scientific Name
            </label>
            <input
              className={`${input} ${
                formData.sciName ? borderStandard : borderRequired
              } italic`}
              id="grid-sci-name"
              type="text"
              value={formData.sciName}
              onChange={(e) =>
                setFormData({ ...formData, sciName: e.target.value })
              }
            />
            {!formData.sciName && (
              <p className={warningText}>This field is required</p>
            )}
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className={label} htmlFor="grid-nickname">
              Nickname
            </label>
            <input
              className={`${input} ${borderStandard}`}
              id="grid=nickname"
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
            />
          </div>
        </div>
        <div className="justify-center text-center">
          <h2 className={subTitle}>Instructions (Optional)</h2>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={label} htmlFor="grid-watering">
              Watering
            </label>
            <input
              className={`${input} ${borderStandard}`}
              id="grid-watering"
              type="textarea"
              value={formData.instructions.watering}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructions: {
                    ...formData.instructions,
                    watering: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={label} htmlFor="grid-light">
              Light - Direction
            </label>
            <input
              className={`${input} ${borderStandard}`}
              id="grid-light"
              type="text"
              value={formData.instructions.light.direction}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructions: {
                    ...formData.instructions,
                    light: {
                      ...formData.instructions.light,
                      direction: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={label} htmlFor="grid-light">
              Light - Intensity
            </label>
            <input
              className={`${input} ${borderStandard}`}
              id="grid-light"
              type="text"
              value={formData.instructions.light.intensity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructions: {
                    ...formData.instructions,
                    light: {
                      ...formData.instructions.light,
                      intensity: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
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
