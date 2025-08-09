import { useState, useEffect } from "react";
import { Line, Pie, Bar, Radar, Scatter, PolarArea } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

const ChartComponent = ({ type, data, options }) => {
    if (!data.datasets.length) return <p className="text-center text-gray-500">Loading chart...</p>;
    const Chart = 
        type === "line" ? Line :
        type === "pie" ? Pie :
        type === "bar" ? Bar :
        type === "radar" ? Radar :
        type === "scatter" ? Scatter : PolarArea;
    return <Chart data={data} options={options} />;
};

export default function LandingPage() {
    const [chartData, setChartData] = useState({
        line: { labels: [], datasets: [] },
        pie: { labels: [], datasets: [] },
        bar: { labels: [], datasets: [] },
        radar: { labels: [], datasets: [] },
        scatter: { datasets: [] },
        polarArea: { labels: [], datasets: [] },  // Added for Polar Area chart
    });

    const [options, setOptions] = useState({});

    useEffect(() => {
        const theme = {
            primary: "rgba(75, 192, 192, 1)",
            danger: "rgba(255, 99, 132, 1)",
            info: "rgba(54, 162, 235, 1)",
            warning: "rgba(255, 206, 86, 1)",
        };

        setChartData({
            line: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A", borderColor: theme.primary },
                    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B", borderColor: theme.danger },
                ],
            },
            pie: {
                labels: ["A", "B", "C"],
                datasets: [{ data: [30, 50, 20], backgroundColor: [theme.primary, theme.danger, theme.info] }],
            },
            bar: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                    { label: "Revenue", data: [50, 75, 60, 80, 90, 70, 100], backgroundColor: theme.primary },
                    { label: "Expenses", data: [30, 50, 40, 60, 80, 50, 90], backgroundColor: theme.danger },
                ],
            },
            radar: {
                labels: ["Speed", "Strength", "Agility", "Stamina", "Skill"],
                datasets: [
                    {
                        label: "Player A",
                        data: [80, 90, 70, 85, 75],
                        borderColor: theme.primary,
                        backgroundColor: "rgba(75, 192, 192, 0.3)",
                    },
                    {
                        label: "Player B",
                        data: [60, 85, 90, 70, 80],
                        borderColor: theme.danger,
                        backgroundColor: "rgba(255, 99, 132, 0.3)",
                    },
                ],
            },
            scatter: {
                datasets: [
                    {
                        label: "Scatter Dataset",
                        data: [
                            { x: 10, y: 20 },
                            { x: 15, y: 25 },
                            { x: 25, y: 10 },
                            { x: 30, y: 50 },
                            { x: 40, y: 40 },
                        ],
                        borderColor: theme.primary,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        pointRadius: 5,
                    },
                ],
            },
            polarArea: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        data: [11, 16, 7, 3, 14, 10],
                        backgroundColor: [theme.primary, theme.danger, theme.info, theme.warning, "#9B59B6", "#FF7F50"],
                    },
                ],
            },
        });

        setOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: "#333" } } },
        });
    }, []);

    return (
        
            <div className="flex flex-col items-center justify-center space-y-10 py-10">
                {["line", "pie", "bar", "radar", "scatter", "polarArea"].map((type, index) => (
                    <div key={index} className="w-[90%] md:w-[60%] bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray mb-4">
                            {type === "line" ? "📈 Line Chart" :
                             type === "pie" ? "🥧 Pie Chart" :
                             type === "bar" ? "📊 Bar Chart" :
                             type === "radar" ? "🕸️ Radar Chart" :
                             type === "scatter" ? "🌌 Scatter Plot" : "🔵 Polar Area Chart"}
                        </h2>
                        <div className="h-[300px]">
                            <ChartComponent type={type} data={chartData[type]} options={options} />
                        </div>
                    </div>
                ))}
            </div>
        
    );
}
