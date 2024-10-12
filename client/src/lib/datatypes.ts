// Type for hourly data (used in today data)
export interface HourlyData {
	name: string;
	value: number;
}

// Type for daily data (used in week data)
export interface DailyData {
	name: string;
	value: number;
}

// Type for weekly data (used in month data)
export interface WeeklyData {
	name: string;
	value: number;
}

// Type for monthly data (used in year data)
export interface MonthlyData {
	name: string;
	value: number;
}

// Type for the cost data section
export interface CostData {
	costDataToday: HourlyData[];
	costDataThisWeek: DailyData[];
	costDataThisMonth: WeeklyData[];
	costDataThisYear: MonthlyData[];
}

// Type for the programs running section (it uses the same structures but with a number of programs)
export interface ProgramsRunningData {
	programsRunningToday: { name: string; value: number }[];
	programsRunningThisWeek: { name: string; value: number }[];
	programsRunningThisMonth: { name: string; value: number }[];
	programsRunningThisYear: { name: string; value: number }[];
}

// Type for power consumption data
export interface PowerConsumptionData {
	powerConsumptionToday: HourlyData[];
	powerConsumptionThisWeek: DailyData[];
	powerConsumptionThisMonth: WeeklyData[];
	powerConsumptionThisYear: MonthlyData[];
}

// Type for bandwidth usage data
export interface BandwidthUsageData {
	bandwidthUsageToday: HourlyData[];
	bandwidthUsageThisWeek: DailyData[];
	bandwidthUsageThisMonth: WeeklyData[];
	bandwidthUsageThisYear: MonthlyData[];
}

// The main type for the entire JSON structure
export interface AllData {
	costData: CostData;
	programsRunning: ProgramsRunningData;
	powerConsumption: PowerConsumptionData;
	bandwidthUsage: BandwidthUsageData;
}
