import { useState, useEffect } from "react";
import {FileUploader} from "../index";
export default function PlantCardModal(props: any) {
    const title= `block uppercase tracking-wide text-slate-700 text-s font-bold mb-2`
    const subTitle= `block uppercase tracking-wide text-slate-700 text-xs font-bold mb-2`
    const label = `block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`;
    const input = `appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`
    const borderStandard = `border border-gray-500`;
    const borderRequired = `border border-red-500`;
    const warningText = `text-red-500 text-xs italic`

    const [formData, setFormData] = useState({
        id: "",
        thumb: "/monstera.webp",
        alert: false,
        sciName: "Monstera Deliciosa",
        nickname: "Frankenstein's Monstera",
        room: props.rooms[0],
        instructions: {
            watering: "Flood and Draing every 2 weeks. Mist leaves 2x weekly",
            light: "indirect"
        }
    });

    const fillRooms = (data: string[]) => {
        return data.map(room => {return(<option key={data.indexOf(room)}>{room}</option>)});
    }

    const handleFileSelect = (file) => {
        setFormData({...formData, thumb: URL.createObjectURL(file)})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({...formData, id: `${formData.room.slice(0,3)}${formData.sciName.slice(0,3)}${formData.nickname.slice(0,3)}`})
        props.handleSubmit(formData);
    }
    return(
        <div className=" w-fit h-full bg-white border border-[#eaeaea] hover:border-[#0070f3] shadow-2xl blur-none scale-100 ease-out duration-1000 justify-center align-center px-2 rounded-lg">
            <button onClick={props.cancel}>x</button>
            <h2 className="grid grid-cols-3 gap-1"><p></p><p className={title}>Add a new plant</p><p></p></h2>
            <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                <FileUploader
                    onFileSelect={handleFileSelect}
                />
                <h2 className="grid grid-cols-3 gap-1"><p></p><p className={subTitle}>General Info</p><p></p></h2>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className={label} htmlFor="grid-sci-name">
                            Scientific Name
                        </label>
                        <input className={`${input} ${formData.sciName? borderStandard: borderRequired} italic`} id="grid-sci-name" type="text" value={formData.sciName} onChange={(e) => setFormData({...formData, sciName: e.target.value})} />
                        {!formData.sciName && <p className={warningText}>This field is required</p>}
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className={label} htmlFor="grid-nickname">
                            Nickname
                        </label>
                        <input className={`${input} ${borderStandard}`} id="grid=nickname" type="text" value={formData.nickname} onChange={(e)=>setFormData({...formData, nickname: e.target.value})} />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-5 md:mb-0">
                        <label className={label} htmlFor="grid-room">
                            Room
                        </label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-non focus:bg-white focus:border-gray-500" id="grid-room" value={formData.room} onChange={(e)=>setFormData({...formData, room: e.target.value})}>
                                {fillRooms(props.rooms)}
                            </select>
                        </div>
                    </div>
                </div>
                <h2 className="grid grid-cols-3 gap-1"><p></p><p className={subTitle}>Instructions</p><p></p></h2>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className={label} htmlFor="grid-watering">
                            Watering
                        </label>
                        <input className={`${input} ${borderStandard}`} id="grid-watering" type="textarea" value={formData.instructions.watering} onChange={(e) => setFormData({...formData, instructions: {...formData.instructions, watering: e.target.value}})} />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className={label} htmlFor="grid-light">
                           Light 
                        </label>
                        <input className={`${input} ${borderStandard}`} id="grid-light" type="text" value={formData.instructions.light} onChange={(e) => setFormData({...formData, instructions: {...formData.instructions, light: e.target.value}})} />
                    </div>

                </div>
                <input className={input} type="submit" value="Submit" />
            </form>
        </div>
    )
}