export default function Alert({text}: any) {
    return (
        <div className="align-middle text-center bg-red-500">
            <p className="text-sm md:text-base antialiased">{text}</p>
        </div>
    );
}