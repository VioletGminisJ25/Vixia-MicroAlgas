import ThemeSwitch from "./ui/ThemeSwitch";
import { Link } from "react-router-dom";
interface HeatherProps {
    texto: string;
    showCompare?: boolean;
    showMediciones?: boolean;
    showSensores?: boolean;
    showPrediciones?: boolean;
    showBack?: boolean;
    showPh?: boolean;
    showTemp?: boolean;
}

export default function Heather({
    texto,
    showCompare = true,
    showSensores = true,
    showPrediciones = true,
    showBack = true,

}: HeatherProps) {
    return (<header className="h-[10dvh] bg-white shadow-lg px-6 flex justify-between items-center dark:bg-[#0f1011] dark:shadow-lg/100">
        <div className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-400 text-transparent bg-clip-text">{texto}</div>

        <nav className="space-x-10 flex items-center">
            <div className="flex items-center gap-10 text-black dark:text-white">
                {
                    showCompare && (
                        <Link to="/comparacion">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M3 15L8 9L13 13L21 5" // Green line: Starts lower, goes higher
                                        stroke="#10B981" // Tailwind emerald-500
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M3 18L8 14L13 17L21 10" // Gray line: Starts higher, ends lower than the green line
                                        stroke="#9CA3AF" // Tailwind gray-400
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Comparar
                            </button>
                        </Link>
                    )
                }
                {
                    showSensores && (
                        <Link to="/sensores">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-yellow-400 dark:text-yellow-600"
                                    width="22"
                                    height="22"
                                    fill="none"
                                    viewBox="0 0 24 26"
                                    stroke="#FACC14"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a5 5 0 1 0 4 0Z" />
                                </svg>
                                Sensores
                            </button>
                        </Link>
                    )
                }

                {
                    showPrediciones && (
                        <Link to="/predicciones">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 64 64" fill="#FB923C">

                                    <rect x="2" y="20" width="12" height="24" rx="2" />

                                    <rect x="50" y="20" width="12" height="24" rx="2" />


                                    <rect x="24" y="24" width="16" height="16" rx="3" />


                                    <line x1="32" y1="12" x2="32" y2="24" stroke="#FB923C" stroke-width="4" stroke-linecap="round" />
                                    <circle cx="32" cy="10" r="2" fill="#FB923C" />

                                    <line x1="24" y1="32" x2="40" y2="32" stroke="#fff" stroke-width="2" />
                                    <line x1="32" y1="24" x2="32" y2="40" stroke="#fff" stroke-width="2" />
                                </svg>

                                Prediciones
                            </button>
                        </Link>
                    )
                }
                {
                    showBack && (
                        <Link to="/">
                            <button
                                className="group cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-green-400 text-green-700 h-9 px-3">
                                <svg className="lucide lucide-arrow-left" strokeLinejoin="round" strokeLinecap="round"
                                    strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="22" width="22"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="m12 19-7-7 7-7" />
                                    <path d="M19 12H5" />
                                </svg>
                                <span className="origin-left scale-0 transition-transform group-hover:scale-100">
                                    Home
                                </span>
                            </button>
                        </Link>
                    )
                }
            </div>
            <ThemeSwitch />
        </nav>
    </header>);
}
