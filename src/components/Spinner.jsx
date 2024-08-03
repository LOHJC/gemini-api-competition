export default function Spinner(){
    return (
    <svg className={`animate-spin mx-auto h-[84px] w-[84px] py-3`} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" 
            stroke="currentColor"
            strokeWidth="4"
            fill="none" d="M12 2
               A 10 10 0 0 1 22 12"></path>
    </svg>);
}