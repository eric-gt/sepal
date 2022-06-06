import { useState } from "react";
import Image from "next/image";
import { Alert, CardFeed } from "../index";

export interface PlantData {
  id: string;
  alert: boolean;
  thumb: string;
  sciName: string;
  nickname: string;
  room: string;
  instructions: {
    water: {
      amount: string;
      interval: number;
    };
    soil: string;
    light: string;
    humidity: string;
    temperature: number;
  };
}
export default function PlantCard({
  data,
  expanded,
}: {
  data: PlantData;
  expanded: boolean;
}) {
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
  const [isExpanded, setIsExpanded] = useState(expanded);

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
  return (
    <div onClick={toggleExpanded} className={card}>
      {data.alert && (
        <div className="grid grid-cols-3">
          <div></div>
          <div></div>
          <Alert text="Needs Water!" />
        </div>
      )}
      <div className="flex flex-row box-border pr-2 mt-2 space-x-3 ">
        <Image
          className="basis-16 object-cover"
          width="64"
          height="64"
          src={data.thumb}
          alt={"a thumbnail with a photo of your plant!"}
        />
        {isExpanded && (
          <div id={`${data.id}-main-info`} className="basis-auto ">
            <p>
              Scientific Name: <i>{data.sciName}</i>
            </p>
            <p>Nickname: {data.nickname}</p>
            <p>Room: {data.room}</p>
          </div>
        )}
        {!isExpanded && (
          <div
            id={`${data.id}-collapsed-view`}
            className="align-bottom text-center space-y-1"
          >
            <p className="mt-4 md:mt-2">{data.nickname}</p>
            <p className="italic">({abbrev(data.sciName)})</p>
          </div>
        )}
      </div>
      {isExpanded && (
        <div id={`${data.id}-instructions`} className="py-4 pr-4 ">
          <p className="pb-2">Watering: {data.instructions.water}</p>
          <p className="pb-2">Light: {data.instructions.light}</p>
        </div>
      )}
      {isExpanded && (
        <div id={`${data.id}-feeds`} className="grid gap-2 grid-cols-2 pr-4">
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
                text: '"Our child is thriving" ~Eric',
                date: "April 4th",
                key: 0,
              },
              { text: '"Do your dishes" ~Despina', date: "March 20th", key: 1 },
            ]}
          />
        </div>
      )}
    </div>
  );
}
