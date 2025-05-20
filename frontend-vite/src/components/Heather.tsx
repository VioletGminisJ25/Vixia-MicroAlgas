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
    showPh = true,
    showTemp = true,
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
                                <svg className="lucide lucide-rocket text-cyan-500 dark:text-cyan-400" strokeLinejoin="round"
                                    strokeLinecap="round" strokeWidth="2" stroke="#06B6D4" fill="none" viewBox="0 0 24 24"
                                    height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                    <path
                                        d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
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
                                <svg className="lucide lucide-sticky-note text-yellow-400 dark:text-yellow-600" strokeLinejoin="round"
                                    strokeLinecap="round" strokeWidth="2" stroke="#FACC14" fill="none" viewBox="0 0 24 24"
                                    height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
                                    <path d="M15 3v6h6" />
                                </svg>
                                Sensores?
                            </button>
                        </Link>
                    )
                }

                {
                    showPrediciones && (
                        <Link to="/predicciones">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg className="lucide lucide-star text-orange-400 dark:text-orange-600" strokeLinejoin="round"
                                    strokeLinecap="round" strokeWidth="2" stroke="#FB923C" fill="#FB923C" viewBox="0 0 24 24"
                                    height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                    <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                Prediciones
                            </button>
                        </Link>
                    )
                }
                {
                    showPh && (
                        <Link to="/ph">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg className="lucide lucide-star text-orange-400 dark:text-orange-600" strokeLinejoin="round"
                                    strokeLinecap="round" strokeWidth="2" stroke="#FB923C" fill="#FB923C" viewBox="0 0 24 24"
                                    height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                    <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                ph?
                            </button>
                        </Link>
                    )
                }
                {
                    showTemp && (
                        <Link to="/temperature">
                            <button
                                className="cursor-pointer bg-[#ffffff] dark:bg-[#0f1011] relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] dark:hover:bg-[#1d1f21] hover:text-[#06B6D4] h-9 px-3">
                                <svg className="lucide lucide-star text-orange-400 dark:text-orange-600" strokeLinejoin="round"
                                    strokeLinecap="round" strokeWidth="2" stroke="#FB923C" fill="#FB923C" viewBox="0 0 24 24"
                                    height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                    <polygon
                                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                Temp?
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
