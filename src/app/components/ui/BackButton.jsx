import { LuArrowLeft } from 'react-icons/lu'

const BackButton = ({ handleBack, title }) => {
    return (
        <button
            type="button"
            onClick={handleBack}
            className="group mb-1 inline-flex items-center gap-2 rounded-full bg-indigo-600 pl-2 pr-4 md:px-4 py-1 md:py-2.5 text-sm cursor-pointer text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
        >
            <LuArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {title}
        </button>

    )
}

export default BackButton