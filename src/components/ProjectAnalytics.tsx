"use client";

import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRightIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, PolarArea } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

// Colors for charts
const COLORS = [
  "rgba(59, 130, 246, 0.8)",  // Blue
  "rgba(16, 185, 129, 0.8)",  // Green
  "rgba(245, 158, 11, 0.8)",  // Yellow
  "rgba(239, 68, 68, 0.8)",   // Red
  "rgba(139, 92, 246, 0.8)",  // Purple
  "rgba(236, 72, 153, 0.8)",  // Pink
];

const BORDER_COLORS = [
  "rgba(59, 130, 246, 1)",
  "rgba(16, 185, 129, 1)",
  "rgba(245, 158, 11, 1)",
  "rgba(239, 68, 68, 1)",
  "rgba(139, 92, 246, 1)",
  "rgba(236, 72, 153, 1)",
];

const PRIORITY_COLORS: Record<string, string> = {
    LOW: "text-red-650 bg-red-100 dark:text-red-400 dark:bg-red-950/50",
    MEDIUM: "text-blue-650 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/50",
    HIGH: "text-emerald-650 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50",
};

interface ProjectAnalyticsProps {
  project: any;
  tasks: any[];
}

const ProjectAnalytics = ({ project, tasks }: ProjectAnalyticsProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const { stats, statusChartData, typeChartData, trendChartData, workloadChartData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            inProgress: 0,
            todo: 0,
            overdue: 0,
        };

        const statusMap: Record<string, number> = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const typeMap: Record<string, number> = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };
        const priorityMap: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };

        // Assignee workload mapping
        const assigneeMap: Record<string, number> = {};

        tasks.forEach((t) => {
            if (t.status === "DONE") stats.completed++;
            if (t.status === "IN_PROGRESS") stats.inProgress++;
            if (t.status === "TODO") stats.todo++;
            if (t.due_date && new Date(t.due_date) < now && t.status !== "DONE") stats.overdue++;

            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
            if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;

            const email = t.assignee?.email || "Unassigned";
            assigneeMap[email] = (assigneeMap[email] || 0) + 1;
        });

        // 7-day trend calculations
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const trendLabels = last7Days.map(d => format(d, "dd MMM"));
        
        const createdCounts = last7Days.map(day => {
            const dayStr = format(day, "yyyy-MM-dd");
            return tasks.filter(t => t.createdAt && format(new Date(t.createdAt), "yyyy-MM-dd") === dayStr).length;
        });

        const completedCounts = last7Days.map(day => {
            const dayStr = format(day, "yyyy-MM-dd");
            return tasks.filter(t => t.status === "DONE" && t.updatedAt && format(new Date(t.updatedAt), "yyyy-MM-dd") === dayStr).length;
        });

        // Tasks by Status Chart Data
        const statusChartData = {
            labels: Object.keys(statusMap).map(k => k.replace("_", " ")),
            datasets: [{
                label: "Tasks Count",
                data: Object.values(statusMap),
                backgroundColor: [
                    "rgba(59, 130, 246, 0.7)",   // To Do - Blue
                    "rgba(245, 158, 11, 0.7)",   // In Progress - Yellow
                    "rgba(16, 185, 129, 0.7)",   // Done - Green
                ],
                borderColor: [
                    "rgba(59, 130, 246, 1)",
                    "rgba(245, 158, 11, 1)",
                    "rgba(16, 185, 129, 1)",
                ],
                borderWidth: 1.5,
                borderRadius: 4,
            }]
        };

        // Tasks by Type Chart Data
        const activeTypes = Object.entries(typeMap).filter(([_, v]) => v > 0);
        const typeChartData = {
            labels: activeTypes.map(([k]) => k),
            datasets: [{
                data: activeTypes.map(([_, v]) => v),
                backgroundColor: COLORS.slice(0, activeTypes.length),
                borderColor: BORDER_COLORS.slice(0, activeTypes.length),
                borderWidth: 1.5,
            }]
        };

        // Trend Chart Data
        const trendChartData = {
            labels: trendLabels,
            datasets: [
                {
                    label: "Tasks Created",
                    data: createdCounts,
                    borderColor: "rgba(59, 130, 246, 1)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: "rgba(59, 130, 246, 1)",
                },
                {
                    label: "Tasks Completed",
                    data: completedCounts,
                    borderColor: "rgba(16, 185, 129, 1)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: "rgba(16, 185, 129, 1)",
                }
            ]
        };

        // Workload Chart Data
        const workloadChartData = {
            labels: Object.keys(assigneeMap),
            datasets: [{
                label: "Tasks Assigned",
                data: Object.values(assigneeMap),
                backgroundColor: COLORS.slice(0, Object.keys(assigneeMap).length),
                borderColor: BORDER_COLORS.slice(0, Object.keys(assigneeMap).length),
                borderWidth: 1.5,
            }]
        };

        return {
            stats,
            statusChartData,
            typeChartData,
            trendChartData,
            workloadChartData,
            priorityData: Object.entries(priorityMap).map(([k, v]) => ({
                name: k,
                value: v,
                percentage: total > 0 ? Math.round((v / total) * 100) : 0,
            })),
        };
    }, [tasks]);

    const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "text-emerald-600 dark:text-emerald-400",
            icon: <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />,
            bg: "bg-emerald-250 dark:bg-emerald-500/10",
        },
        {
            label: "Active Tasks",
            value: stats.inProgress,
            color: "text-blue-600 dark:text-blue-400",
            icon: <Clock className="size-5 text-blue-600 dark:text-blue-400" />,
            bg: "bg-blue-250 dark:bg-blue-500/10",
        },
        {
            label: "Overdue Tasks",
            value: stats.overdue,
            color: "text-red-600 dark:text-red-400",
            icon: <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />,
            bg: "bg-red-250 dark:bg-red-500/10",
        },
        {
            label: "Team Size",
            value: project?.members?.length || 0,
            color: "text-purple-600 dark:text-purple-400",
            icon: <Users className="size-5 text-purple-600 dark:text-purple-400" />,
            bg: "bg-purple-250 dark:bg-purple-500/10",
        },
    ];

    const gridChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? "#e4e4e7" : "#3f3f46",
                    font: { family: "Inter, sans-serif", size: 11 }
                }
            },
            tooltip: {
                padding: 10,
                cornerRadius: 6,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFont: { family: "Inter, sans-serif" },
                bodyFont: { family: "Inter, sans-serif" }
            }
        },
        scales: {
            x: {
                grid: { color: isDark ? "rgba(244, 244, 245, 0.06)" : "rgba(63, 63, 70, 0.06)" },
                ticks: { color: isDark ? "#a1a1aa" : "#71717a", font: { size: 10 } }
            },
            y: {
                grid: { color: isDark ? "rgba(244, 244, 245, 0.06)" : "rgba(63, 63, 70, 0.06)" },
                ticks: { color: isDark ? "#a1a1aa" : "#71717a", font: { size: 10 }, stepSize: 1 }
            }
        }
    };

    const radialChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? "#e4e4e7" : "#3f3f46",
                    font: { family: "Inter, sans-serif", size: 11 }
                }
            },
            tooltip: {
                padding: 10,
                cornerRadius: 6,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFont: { family: "Inter, sans-serif" },
                bodyFont: { family: "Inter, sans-serif" }
            }
        }
    };

    const polarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? "#e4e4e7" : "#3f3f46",
                    font: { family: "Inter, sans-serif", size: 11 }
                }
            },
            tooltip: {
                padding: 10,
                cornerRadius: 6,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFont: { family: "Inter, sans-serif" },
                bodyFont: { family: "Inter, sans-serif" }
            }
        },
        scales: {
            r: {
                grid: { color: isDark ? "rgba(244, 244, 245, 0.06)" : "rgba(63, 63, 70, 0.06)" },
                angleLines: { color: isDark ? "rgba(244, 244, 245, 0.06)" : "rgba(63, 63, 70, 0.06)" },
                ticks: { color: isDark ? "#a1a1aa" : "#71717a", backdropColor: "transparent", font: { size: 8 } }
            }
        }
    };

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-zinc-500 dark:text-zinc-400">Loading Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full overflow-hidden">
                {metrics.map((m, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 w-full max-w-full overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{m.label}</p>
                                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                            </div>
                            <div className={`p-2 rounded-md ${m.bg}`}>{m.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full overflow-hidden animate-fade-in">
                {/* Tasks by Status */}
                <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 h-96 w-full max-w-full overflow-hidden">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Status</h2>
                    <div className="h-72 w-full relative">
                        <Bar key={isDark ? "dark" : "light"} data={statusChartData} options={gridChartOptions} />
                    </div>
                </div>

                {/* Tasks by Type */}
                <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 h-96 w-full max-w-full overflow-hidden">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Type</h2>
                    <div className="h-72 w-full relative">
                        <Pie key={isDark ? "dark" : "light"} data={typeChartData} options={radialChartOptions} />
                    </div>
                </div>

                {/* Task Activity Trend */}
                <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 h-96 w-full max-w-full overflow-hidden">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Task Activity Trend (7 Days)</h2>
                    <div className="h-72 w-full relative">
                        <Line key={isDark ? "dark" : "light"} data={trendChartData} options={gridChartOptions} />
                    </div>
                </div>

                {/* Workload Allocation */}
                <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 h-96 w-full max-w-full overflow-hidden">
                    <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Assignee Workload Allocation</h2>
                    <div className="h-72 w-full relative">
                        <PolarArea key={isDark ? "dark" : "light"} data={workloadChartData} options={polarChartOptions} />
                    </div>
                </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 sm:p-6 w-full max-w-full overflow-hidden">
                <h2 className="text-zinc-900 dark:text-white mb-4 font-medium">Tasks by Priority</h2>
                <div className="space-y-4">
                    {priorityData.map((p) => (
                        <div key={p.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <ArrowRightIcon className={`size-3.5`} />
                                    <span className="text-zinc-900 dark:text-zinc-200 capitalize font-medium">{p.name.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">{p.value} tasks</span>
                                    <span className="px-2 py-0.5 border border-zinc-400 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded">
                                        {p.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-zinc-300 dark:bg-zinc-800 rounded-full h-1.5 font-semibold">
                                <div
                                    className={`h-1.5 rounded-full ${PRIORITY_COLORS[p.name] || 'bg-zinc-500'}`}
                                    style={{ width: `${p.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;
