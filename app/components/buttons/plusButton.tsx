const PlusButton = (props: { handleClick: () => void }) => {
  return (
    <button
      onClick={props.handleClick}
      className="ease-in duration-150 min-w-[75%] min-h-fit bg-slate-500 hover:bg-slate-400 rounded-lg "
    >
      <p className="text-white text-base md:text-lg font-semibold">+</p>
    </button>
  );
};

export default PlusButton;
