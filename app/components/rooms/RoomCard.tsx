import { useState } from "react";
import { Room, Plant } from "../../types";
import PlantCard from "../plantCard/plantCard";

interface RoomProps {
  id: string;
  roomId: string;
  plants: Plant[];
  name: string;
  lighting: {
    direction: string;
    intensity: string;
  };
  isExpanded: boolean;
}
const RoomCard = (props: RoomProps) => {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderPlantCards = () => {
    const plantCards = props.plants.map((plant: Plant) => {
      return (
        <PlantCard
          key={plant.id}
          expanded={isExpanded}
          id={`${plant.id}-card`}
          alert={plant.alert}
          thumb={plant.attachment}
          sciName={plant.sciName}
          nickname={plant.nickname}
          instructions={plant.instructions}
        />
      );
    });
    return plantCards;
  };
  const renderCollapsedCard = () => {
    return (
      <div
        id={`${props.id}-collapsed-view`}
        className="align-bottom text-left space-y-1"
      >
        <p>{props.name}</p>
        <p className="italic"> {props.plants.length ?? 0} Plants</p>
      </div>
    );
  };
  const renderExpandedCard = () => {
    return (
      <div id={`${props.id}-expanded-view`}>
        <div id={`${props.id}-plants`}>{renderPlantCards()}</div>
      </div>
    );
  };
  return (
    <div id={`${props.id}-card`} onClick={toggleExpanded}>
      {isExpanded ? renderExpandedCard() : renderCollapsedCard()}
    </div>
  );
};

export default RoomCard;
