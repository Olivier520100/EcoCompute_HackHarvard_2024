"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DollarSign, Server, Zap } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import MultipleFileUpload from "@/components/multiple-file-upload";

import * as dataTypes from "@/lib/datatypes"; // Adjust the path based on your project structure

const data_labels_x = [
	{ name: "0", value: 10 },
	{ name: "10", value: 20 },
	{ name: "20", value: 30 },
	{ name: "30", value: 40 },
	{ name: "40", value: 50 },
	{ name: "50", value: 60 },
	{ name: "60", value: 70 },
	// More data points (700x700)
];

const formatXAxis = (tick: string) => {
	// Show only ticks for 10, 20, 30, 40, 50, 60 mins
	return ["10", "20", "30", "40", "50", "60"].includes(tick)
		? `${tick} mins`
		: "";
};

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import fakedata from "@/lib/fakedata.json";

export default function Dashboard() {
	// eslint-disable-line
	const [data] = useState<dataTypes.AllData>(fakedata);
	const [data_hour, setData_Hour] = useState<dataTypes.DataHourly>();
	const [timePeriod, setTimePeriod] = useState<TimePeriod>("hour");
	const [isConnected, setIsConnected] = useState(false);
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		console.log("WebSocketProvider mounted");
		ws.current = new WebSocket(
			"wss://meerkat-expert-rarely.ngrok-free.app/infoconnection/fake_client_id",
		);

		ws.current.onopen = () => {
			console.log("WebSocket connected");
			setIsConnected(true);
		};

		ws.current.onclose = (event) => {
			console.log("WebSocket disconnected:", event);
			setIsConnected(false);
		};

		ws.current.onerror = (error) => {
			console.error("WebSocket error observed:", error);
		};

		return () => {
			console.log("WebSocketProvider unmounted");
			ws.current?.close();
		};
	}, []);

	useEffect(() => {
		if (!ws.current) return; // Check ws.current

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			console.log("🚀 ~ handleMessage ~ data:", data);
			setData_Hour(data);
		};

		ws.current.addEventListener("message", handleMessage);

		return () => {
			ws.current?.removeEventListener("message", handleMessage);
		};
	}, []);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Company Usage Dashboard</h1>

				<div className="flex flex-row gap-1">
					<MultipleFileUpload />
					<Button type="button">Submit</Button>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{timePeriod} <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setTimePeriod("hour")}>
							Hourly
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("today")}>
							Today
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("week")}>
							This Week
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("month")}>
							This Month
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("year")}>
							This Year
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<ChartCard
					title="Power Consumption"
					icon={<Zap className="h-4 w-4 text-muted-foreground" />}
					data={data.powerConsumption}
					data_hour={data_hour?.consumption}
					timePeriod={timePeriod}
					setTimePeriod={setTimePeriod}
					dataKey="powerConsumption"
					label="kWh"
				/>
				<ChartCard
					title="Energy Production"
					icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
					data={data.costData}
					data_hour={data_hour?.production}
					timePeriod={timePeriod}
					setTimePeriod={setTimePeriod}
					dataKey="costData"
					label="MW"
				/>
				<ChartCard
					title="Programs Running"
					icon={<Server className="h-4 w-4 text-muted-foreground" />}
					data={data.programsRunning}
					data_hour={data_hour?.containers}
					setTimePeriod={setTimePeriod}
					timePeriod={timePeriod}
					dataKey="programsRunning"
					label="Programs"
				/>
			</div>

			<h1>
				`Compute Price per MW/h:
				{data_hour?.production.hourly[0].value
					? Math.abs(data_hour?.prices.hourly[0].value)
					: data_hour?.prices.hourly[0].value}
				$`
			</h1>
		</div>
	);
}

interface ChartCardProps {
	title: string;
	icon: React.ReactNode;
	data_hour: dataTypes.DataCategory | undefined;
	data:
		| dataTypes.PowerConsumptionData
		| dataTypes.CostData
		| dataTypes.ProgramsRunningData;
	timePeriod: TimePeriod;
	setTimePeriod: Dispatch<SetStateAction<TimePeriod>>;
	dataKey: string;
	label: string;
}

type TimePeriod = "hour" | "today" | "week" | "month" | "year" | "";

function ChartCard({
	title,
	icon,
	data,
	data_hour,
	timePeriod,
	setTimePeriod,
	dataKey,
	label,
}: ChartCardProps) {
	console.log("🚀 ~ data_hour:", data_hour);
	// eslint-disable-line
	const [selectedYears, setSelectedYears] = useState<dataTypes.oldData[]>([]);
	const [isCurrentYearSelected] = useState(true); // Set to true by default

	const currentYear = new Date().getFullYear();
	const maxSelections = 5;
	const totalSelected = selectedYears.length + (isCurrentYearSelected ? 1 : 0);

	const getChartData = () => {
		const dataSet = (() => {
			switch (timePeriod) {
				case "today":
					return (data as never)[`${dataKey}Today`] || [];
				case "week":
					return (data as never)[`${dataKey}ThisWeek`] || [];
				case "month":
					return (data as never)[`${dataKey}ThisMonth`] || [];
				case "year": {
					return (data as never)[`${dataKey}ThisYear`] || [];
				}

				default:
					return [];
			}
		})();

		// Ensure data is in the correct format
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return dataSet.map((item: any) => ({
			name: item.name,
			value: item.value,
		}));
	};
	// eslint-disable-line
	const getCombinedChartData = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const combinedData: { [key: string]: any } = {};

		// Include data from selected old years
		selectedYears.map((yearData) => {
			yearData.value.map((item) => {
				const { name, value } = item;
				if (!combinedData[name]) {
					combinedData[name] = { name };
				}
				combinedData[name][`value_${yearData.year}`] = value;
			});
		});

		// Include current year's data if selected
		if (isCurrentYearSelected) {
			const currentData = getChartData();
			currentData.map((item) => {
				const { name, value } = item;
				if (!combinedData[name]) {
					combinedData[name] = { name };
				}
				combinedData[name][`value_${currentYear}`] = value;
			});
		}

		return Object.values(combinedData);
	};

	const handleYearChange = (dataOldYear: dataTypes.oldData) => {
		setSelectedYears((prev = []) => {
			// Check if the year is already selected
			if (prev.some((y) => y.year === dataOldYear.year)) {
				// Remove the oldData object if its year matches dataOldYear.year
				return prev.filter((y) => y.year !== dataOldYear.year);
			}

			if (totalSelected < maxSelections) {
				// Add dataOldYear to selectedYears
				return [...prev, dataOldYear];
			}

			// If maximum selections reached, do not add more
			return prev;
		});
	};

	const isYearSelected = (year: number): boolean => {
		return selectedYears.some((item) => item.year === year);
	};

	// Map years to colors
	const yearToColorMap = data.oldData.reduce(
		(acc, yearData, index) => {
			acc[yearData.year] = colors[index % colors.length];
			return acc;
		},
		{} as { [year: number]: string },
	);

	return (
		<Dialog>
			<DialogTrigger
				asChild
				onClick={() => {
					let selectedData: Array<{ name: string; value: number }> | undefined;
					setTimePeriod("year");
					getChartData();
					if (dataKey === "powerConsumption") {
						selectedData = (data as dataTypes.PowerConsumptionData)[
							`${dataKey}ThisYear`
						];
					} else if (dataKey === "costData") {
						selectedData = (data as dataTypes.CostData)[`${dataKey}ThisYear`];
					} else if (dataKey === "programsRunning") {
						selectedData = (data as dataTypes.ProgramsRunningData)[
							`${dataKey}ThisYear`
						];
					}
					setSelectedYears([
						{
							year: 2024,
							value: selectedData
								? selectedData
								: [{ name: "Monday", value: 2 }],
						},
					]);
				}}
			>
				<Card className="cursor-pointer hover:bg-accent/50 transition-colors">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{title}</CardTitle>
						{icon}
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">{label}</p>
						<ChartContainer
							config={{ value: { label: label, color: "" } }}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={
										timePeriod === "hour" ? data_hour?.hourly : getChartData()
									}
								>
									<XAxis dataKey="name" tickFormatter={formatXAxis} />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									{/* Render current year's data in the initial chart */}
									<Area
										key={"hour"}
										type="monotone"
										dataKey="value"
										strokeWidth={2}
										dot={false}
										fillOpacity={0.4}
										fill={colors[6]}
										stroke={colors[6]}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ChartContainer
					config={{ value: { label: label, color: "" } }}
					className="h-[400px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={getCombinedChartData()}>
							<XAxis dataKey="name" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />

							{/* Render selected old years' data */}
							{selectedYears.map((yearData) =>
								yearData.year === 2024 ? (
									<Area
										key={yearData.year}
										type="monotone"
										dataKey={`value_${yearData.year}`}
										strokeWidth={2}
										dot={false}
										fillOpacity={0.4}
										fill={colors[6]}
										stroke={colors[6]}
									/>
								) : (
									<Area
										key={yearData.year}
										type="monotone"
										dataKey={`value_${yearData.year}`}
										strokeWidth={2}
										dot={false}
										fillOpacity={0.4}
										fill={yearToColorMap[yearData.year]}
										stroke={yearToColorMap[yearData.year]}
									/>
								),
							)}
						</AreaChart>
					</ResponsiveContainer>
				</ChartContainer>

				<div className="flex items-center space-x-2 mb-4 mx-auto">
					{/* Checkbox for the current year */}
					<div className="flex items-center">
						<Label
							htmlFor="year-current"
							className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							style={{ color: colors[6] }}
						>
							{currentYear}
						</Label>
					</div>

					{/* Existing checkboxes for old years */}
					{data.oldData.map((yearData) => (
						<div key={yearData.year} className="flex items-center">
							<Checkbox
								id={`year-${yearData.year}`}
								checked={isYearSelected(yearData.year)}
								onCheckedChange={() => handleYearChange(yearData)}
								disabled={
									!isYearSelected(yearData.year) &&
									totalSelected >= maxSelections
								}
							/>
							<Label
								htmlFor={`year-${yearData.year}`}
								className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								style={{ color: yearToColorMap[yearData.year] }}
							>
								{yearData.year}
							</Label>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

const colors: string[] = [
	"#FF5733", // Red
	"#33FF57", // Green
	"#3357FF", // Blue
	"#F1C40F", // Yellow
	"#9B59B6", // Purple
	"#E67E22", // Orange
	"#2ECC71", // Teal
];
