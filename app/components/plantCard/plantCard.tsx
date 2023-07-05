"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Alert, CardFeed } from "../index";
import { Storage } from "aws-amplify";
export default function PlantCard(props: any) {
  const card = `
        mx-2
        mb-4
        pl-4
        pb-6
        align-left
        text-xs
        md:text-base
        border
        border-[#eaeaea]
        hover:border-[#0070f3]
        ease-in
        duration-150
        rounded-lg
        min-h-16
        w-80
        md:w-screen
        max-w-screen-sm
    `;
  const [isExpanded, setIsExpanded] = useState(props.expanded);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const abbrev = (sciName: string): string => {
    let names = sciName.split(" ");
    names[0] = `${names[0].split("")[0]}.`;
    return names.join(" ");
  };
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const forceExpanded = (val: boolean): void => {
    setIsExpanded(val);
  };

  useEffect(() => {
    getAttachment();
  }, []);

  async function getAttachment() {
    if (props.attachment) {
      const url = await Storage.vault.get(props.attachment);
      setAttachmentUrl(url);
    }
  }
  const renderExpandedCard = () => {
    return (
      <div id={`${props.id}-expanded-view`}>
        <div id={`${props.id}-main-info`} className="basis-auto ">
          <p>
            Scientific Name: <i>{props.sciName}</i>
          </p>
          <p>Nickname: {props.nickname}</p>
          <p> Collection: {props.collection?.name}</p>
          <p>Room: {props.room?.name}</p>
        </div>
        <div id={`${props.id}-instructions`} className="py-4 pr-4 ">
          <div id={`${props.id}-watering`}>
            <p className="pb-2">Watering: {props.instructions.watering}</p>
          </div>
          <div id={`${props.id}-lighting`} className="py-4 pr-4">
            <div id={`${props.id}-direction`}>
              <p className="pb-2">
                Light Direction: {props.instructions.light.direction}
              </p>
            </div>
            <div id={`${props.id}-intensity`}>
              <p className="pb-2">
                Light Intensity: {props.instructions.light.intensity}
              </p>
            </div>
          </div>
        </div>
        <div id={`${props.id}-feeds`} className="grid gap-2 grid-cols-2 pr-4">
          <CardFeed
            title="Last Watered"
            buttonText="Water"
            data={[
              { text: "Eric", date: "April 4th", key: 0 },
              { text: "Despina", date: "March 20th", key: 1 },
              { text: "Flannery", date: "March 6th", key: 2 },
            ]}
          />
          <CardFeed
            title="Observations"
            buttonText="Write Note"
            data={[
              {
                text: "Our child is thriving ~Eric",
                date: "April 4th",
                key: 0,
              },
              { text: "Do your dishes ~Despina", date: "March 20th", key: 1 },
            ]}
          />
        </div>
      </div>
    );
  };
  const renderCollapsedCard = () => {
    return (
      <div
        id={`${props.id}-collapsed-view`}
        className="align-bottom text-center space-y-1"
      >
        <p className="mt-4 md:mt-2">{props.nickname}</p>
        <p className="italic">({abbrev(props.sciName)})</p>
        <button
          id={`delete-${props.id}`}
          onClick={() => props.handleDelete(props.plantId)}
        >
          Delete Plant
        </button>
      </div>
    );
  };
  return (
    <div id={`${props.id}`} onClick={toggleExpanded} className={card}>
      {props.alert && (
        <div className="grid grid-cols-3">
          <div></div>
          <div></div>
          <Alert text="Needs Water!" />
        </div>
      )}
      <div className="flex flex-row box-border pr-2 mt-2 space-x-3 ">
        {attachmentUrl !== "" && (
          <Image
            className="basis-16 object-cover"
            width="64"
            height="64"
            src={attachmentUrl}
            alt={"a thumbnail with a photo of your plant!"}
          />
        )}
        {isExpanded ? renderExpandedCard() : renderCollapsedCard()}
      </div>
    </div>
  );
}
