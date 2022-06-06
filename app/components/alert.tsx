export default function Alert({ text }: any) {
  return (
    <div className="align-middle text-center rounded-full py-px bg-red-500">
      <p className="text-sm md:text-base antialiased text-white">{text}</p>
    </div>
  );
}
