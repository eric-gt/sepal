import Image from 'next/image';
import Alert from './alert';
export default function PlantCard(props: any) {
    return (
        <div>
            <div className="grid grid-cols-3">
                <div></div>
                <div></div>
                <Alert text="Needs Water!"/>
            </div>
            <div className = "flex flex-row box-border">
                <Image className="basis-16 object-scale-down" width="64" height="64" src={props.thumb} alt={""}/>
                <div className="basis-auto px-8">
                    <p>Scientific Name: <i>{props.sciName}</i></p>
                    <p>Nickname: {props.nickname}</p>
                    <p>Room: {props.room}</p>
                </div>
            </div>
            <div className="py-4">
                <p className="pb-2">Watering: {props.instructions.water}</p>
                <p className="pb-2">Light: {props.instructions.light}</p>
            </div>
        </div>
    )
}