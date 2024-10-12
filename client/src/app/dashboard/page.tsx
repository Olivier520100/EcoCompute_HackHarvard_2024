"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, DollarSign, Server, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import type * as dataTypes from "@/lib/datatypes"; // Adjust the path based on your project structure

import fakedata from "@/lib/fakedata.json";

export default function Dashboard() {
	const [data, setData] = useState<dataTypes.AllData>({ ...fakedata });

	const [timePeriod, setTimePeriod] = useState("today");

	// useEffect(() => {
	// 	async function fetchData() {
	// 		try {
	// 			const response = await fetch("/fakedata.json"); // No need for relative paths like ../../
	// 			console.log(response);
	// 			if (!response.ok) {
	// 				throw new Error(`HTTP error! status: ${response.status}`);
	// 			}
	// 			const data = await response.json();
	// 			setData(data); // Assuming you have setData from useState
	// 		} catch (error) {
	// 			console.error("Error fetching data:", error);
	// 		}
	// 	}

	// 	fetchData();
	// }, []);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Company Usage Dashboard</h1>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{timePeriod} <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
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
			<div className="grid gap-4 md:grid-cols-2">
				<ChartConsumption
					data={data.powerConsumption}
					timePeriod={timePeriod}
				/>

				<ChartCost data={data.costData} timePeriod={timePeriod} />

				<ChartProgramsRunning
					data={data.programsRunning}
					timePeriod={timePeriod}
				/>

			</div>
		</div>
	);
}

// EACH TYPE OF CHART IS BELOW

function ChartConsumption({
	data,
	timePeriod,
}: { data: dataTypes.PowerConsumptionData; timePeriod: string }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Power Consumption</CardTitle>
				<Zap className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">AMOUNT</div>
				<p className="text-xs text-muted-foreground">POURCENTAGE</p>
				<ChartContainer
					config={{ value: { label: "kWh", color: "" } }}
					className="h-[200px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={
								timePeriod === "today"
									? data?.powerConsumptionToday
									: timePeriod === "week"
										? data?.powerConsumptionThisWeek
										: timePeriod === "month"
											? data?.powerConsumptionThisMonth
											: timePeriod === "year"
												? data?.powerConsumptionThisYear
												: [0]
							}
						>
							<XAxis dataKey="name" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Area
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
	);
}

function ChartCost({
	data,
	timePeriod,
}: { data: dataTypes.CostData; timePeriod: string }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Compute Power Cost
				</CardTitle>
				<DollarSign className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">AMOUNT</div>
				<p className="text-xs text-muted-foreground">POURCENTAGE</p>
				<ChartContainer
					config={{ value: { label: "USD", color: "hsl(var(--chart-2))" } }}
					className="h-[200px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={
								timePeriod === "today"
									? data?.costDataToday
									: timePeriod === "week"
										? data?.costDataThisWeek
										: timePeriod === "month"
											? data?.costDataThisMonth
											: timePeriod === "year"
												? data?.costDataThisYear
												: [0]
							}
						>
							<XAxis dataKey="name" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Area
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
	);
}

function ChartProgramsRunning({
	data,
	timePeriod,
}: { data: dataTypes.ProgramsRunningData; timePeriod: string }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Programs Running</CardTitle>
				<Server className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">AMOUNT</div>
				<p className="text-xs text-muted-foreground">
					+HOW MANY SINCE LAST WTV
				</p>
				<ChartContainer
					config={{
						value: { label: "Programs", color: "hsl(var(--chart-3))" },
					}}
					className="h-[200px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={
								timePeriod === "today"
									? data?.programsRunningToday
									: timePeriod === "week"
										? data?.programsRunningThisWeek
										: timePeriod === "month"
											? data?.programsRunningThisMonth
											: timePeriod === "year"
												? data?.programsRunningThisYear
												: [0]
							}
						>
							<XAxis dataKey="name" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Area
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
