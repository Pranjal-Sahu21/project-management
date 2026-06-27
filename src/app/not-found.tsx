"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { LayoutContext } from "../components/LayoutShell";

export default function NotFound() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const { setHideSidebarAndNavbar } = useContext(LayoutContext);

    useEffect(() => {
        setHideSidebarAndNavbar(true);
        return () => setHideSidebarAndNavbar(false);
    }, [setHideSidebarAndNavbar]);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / 30;
            const y = (e.clientY - innerHeight / 2) / 30;
            setMousePos({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[75vh] md:min-h-[80vh] px-4 text-center select-none overflow-hidden relative font-sans">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-500/[0.06] dark:bg-blue-500/[0.1] rounded-full blur-3xl pointer-events-none" />

            {/* Parallax 404 Text */}
            <div className="relative mb-6">
                {/* Background offset layer moving opposite to the mouse */}
                <div
                    className="absolute inset-0 font-bold text-[22vw] sm:text-[12rem] leading-none select-none pointer-events-none tracking-tighter text-blue-500/10 dark:text-blue-500/20 blur-[2px] font-heading select-none"
                    style={
                        mounted
                            ? {
                                  transform: `translate3d(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px, 0)`,
                                  transition: "transform 0.15s ease-out",
                              }
                            : undefined
                    }
                >
                    404
                </div>

                {/* Foreground text layer moving with the mouse */}
                <div
                    className="relative font-bold text-[22vw] sm:text-[12rem] leading-none select-none pointer-events-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 font-heading"
                    style={
                        mounted
                            ? {
                                  transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
                                  transition: "transform 0.15s ease-out",
                              }
                            : undefined
                    }
                >
                    404
                </div>
            </div>

            {/* Custom Information Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-2 mb-3 tracking-tight">
                This Page is Off the Radar
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                The workspace, project, or page you are looking for has plan-drifted into the void. Let&apos;s get you back on track.
            </p>

            {/* CTA Go Back Home Button */}
            <Link href="/" className="group inline-block">
                <span className="flex items-center gap-1.5 bg-[#09f] hover:bg-[#0088dd] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/15 dark:shadow-blue-500/5 hover:scale-105 active:scale-95">
                    <span>Go Back Home</span>
                    <span className="relative flex items-center justify-center overflow-hidden w-4 h-4 ml-1 shrink-0">
                        <span className="absolute transition-transform duration-300 ease-out translate-x-0 translate-y-0 group-hover:translate-x-3.5 group-hover:-translate-y-3.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </span>
                        <span className="absolute transition-transform duration-300 ease-out -translate-x-3.5 translate-y-3.5 group-hover:translate-x-0 group-hover:translate-y-0">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </span>
                    </span>
                </span>
            </Link>
        </div>
    );
}
