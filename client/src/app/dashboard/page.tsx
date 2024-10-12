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
import { ChevronDown, DollarSign, Server, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Sample data for each metric
const powerData = [
	{ name: "Jan", value: 40000 },
	{ name: "Feb", value: 39000 },
	{ name: "Mar", value: 42000 },
	{ name: "Apr", value: 43000 },
	{ name: "May", value: 45231 },
];

const costData = [
	{ name: "Jan", value: 10000 },
	{ name: "Feb", value: 10500 },
	{ name: "Mar", value: 11000 },
	{ name: "Apr", value: 11500 },
	{ name: "May", value: 12234 },
];

const programsData = [
	{ name: "Jan", value: 300 },
	{ name: "Feb", value: 350 },
	{ name: "Mar", value: 400 },
	{ name: "Apr", value: 450 },
	{ name: "May", value: 573 },
];

const bandwidthData = [
	{ name: "Jan", value: 0.8 },
	{ name: "Feb", value: 0.9 },
	{ name: "Mar", value: 1.0 },
	{ name: "Apr", value: 1.1 },
	{ name: "May", value: 1.2 },
];

export default function Dashboard() {
	// const powerData: number[] = [];
	// const costData: number[] = [];
	// const machinesData: number[] = [];
	// const bandwidthData: number[] = [];
	const [timePeriod, setTimePeriod] = useState("This Month");

	const data: object | undefined = getAllDashBoardData();

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
						<DropdownMenuItem onClick={() => setTimePeriod("Today")}>
							Today
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("This Week")}>
							This Week
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("This Month")}>
							This Month
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTimePeriod("This Year")}>
							This Year
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Power Consumption
						</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">45,231 kWh</div>
						<p className="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
						<ChartContainer
							config={{ value: { label: "kWh", color: "hsl(var(--chart-1))" } }}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={powerData ? powerData : [0]}>
									<XAxis dataKey="name" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="value"
										stroke="var(--color-value)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Compute Power Cost
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$12,234</div>
						<p className="text-xs text-muted-foreground">
							+15% from last month
						</p>
						<ChartContainer
							config={{ value: { label: "USD", color: "hsl(var(--chart-2))" } }}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={costData ? costData : [0]}>
									<XAxis dataKey="name" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="value"
										stroke="var(--color-value)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Programs Running
						</CardTitle>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">573</div>
						<p className="text-xs text-muted-foreground">
							+201 since last month
						</p>
						<ChartContainer
							config={{
								value: { label: "Machines", color: "hsl(var(--chart-3))" },
							}}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={programsData ? programsData : [0]}>
									<XAxis dataKey="name" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="value"
										stroke="var(--color-value)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Network Bandwidth
						</CardTitle>
						<Wifi className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1.2 TB</div>
						<p className="text-xs text-muted-foreground">+5% from last month</p>
						<ChartContainer
							config={{ value: { label: "TB", color: "hsl(var(--chart-4))" } }}
							className="h-[200px]"
						>
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={bandwidthData ? bandwidthData : [0]}>
									<XAxis dataKey="name" />
									<YAxis />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="value"
										stroke="var(--color-value)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function getAllDashBoardData() {
	const [data, setData] = useState<object>();

	useEffect(() => {
		async function name() {
			// get from backend
			// setData()
		}
		name();
	}, []);

	// can seperate different data here

	return data;
}
