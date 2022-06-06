import { useState } from "react";
type FeedLog = {
  text: string;
  date: string;
  key: number;
};
export default function CardFeed(props: any) {
  const [data, setData] = useState(props.data);

  const formatList = (data: FeedLog[]) => {
    return data.map((event) => {
      return (
        <li key={event.key} className="grid grid-cols-2">
          <p className="mx-px">{event.text}</p>
          <p className="mx-px">{event.date}</p>
        </li>
      );
    });
  };

  const addLog = (log: FeedLog) => {
    setData(data.push(log));
  };
  return (
    <div className="text-center text-xs md:text-base flex-wrap align-center justify-center min-w-fit">
      <div className="bg-slate-300 rounded-lg px-px py-1 min-w-fit justify-self-center">
        <h3 className="font-semibold pb-1">{props.title}</h3>
        <ul>{formatList(data)}</ul>
      </div>
      <button
        onClick={props.onclick}
        className="justify-self-center mt-1 px-1 bg-lime-500 hover:bg-lime-400 rounded-lg"
      >
        <p>{props.buttonText}</p>
      </button>
    </div>
  );
}
