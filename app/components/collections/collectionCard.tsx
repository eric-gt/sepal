import { useState } from "react";
import { Collection, Room } from "../../types";
import RoomCard from "../rooms/RoomCard";
import PlusButton from "../buttons/plusButton";
interface CollectionProps {
  id: string;
  collectionId: string;
  name: string;
  rooms: Room[];
  isExpanded: boolean;
  showCardModal: (collectionId: string) => void;
}
const CollectionCard = (props: CollectionProps) => {
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

  const [isExpanded, setIsExpanded] = useState(props.isExpanded);
  const [expandRooms, setExpandRooms] = useState(false);

  const showCardModal = () => {
    props.showCardModal(props.collectionId);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const renderRooms = () => {
    return props.rooms?.map((room) => (
      <RoomCard
        key={room.id}
        id={`${room.id}-view`}
        roomId={room.id ?? "new"}
        name={room.name}
        plants={room.plants}
        lighting={room.lighting}
        isExpanded={expandRooms}
      />
    ));
  };
  const renderExpandedCard = () => {
    return (
      <div id={`${props.id}-expanded-view`}>
        <div id={`${props.id}-info`} className="basis-auto">
          <p>Name: {props.name}</p>
        </div>
        <p>{`Rooms (${props.rooms?.length ?? 0}):`}</p>
        <div
          className="mx-4 pt-6 flex justify-center text-xs md:text-base align-left border border-[#eaeaea] hover:border-[#0070f3] ease-in duration-150 rounded-lg min-h-16 "
          id={`${props.id}-room-list`}
        >
          <div id={`${props.id}-rooms`}>{renderRooms()}</div>
          <PlusButton handleClick={showCardModal} />
        </div>
      </div>
    );
  };
  const renderCollapsedCard = () => {
    return (
      <div
        id={`${props.id}-collapsed-view`}
        className="align-bottom text-left space-y-1"
      >
        <p className="mt4 md:mt-2">{props.name}</p>
        <p className="italic">
          {props.rooms?.length === 1
            ? `1 room`
            : `${props.rooms?.length ?? 0} rooms`}
        </p>
      </div>
    );
  };
  return (
    <div id={props.id} onClick={toggleExpanded} className={card}>
      {isExpanded ? renderExpandedCard() : renderCollapsedCard()}
    </div>
  );
};
export default CollectionCard;
