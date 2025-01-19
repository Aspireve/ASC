import { WandSparkles } from "lucide-react";

const ButtonGradient = ({
    isLoading,
    handleClick
}: { isLoading: boolean; handleClick: () => Promise<void> }) => {
    return (
        <button onClick={handleClick} disabled={isLoading} className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
            <span className="absolute  inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                <WandSparkles className='fill-[#5366e5] w-5 h-5 flex-shrink-0 sm:inline-block hidden mr-2' />
                AI Agreed
            </span>
        </button>
    )
}


export default ButtonGradient
