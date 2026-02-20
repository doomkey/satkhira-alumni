"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SquareUser, UserPen } from "lucide-react";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

const aggregateDataByKey = (data, key) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const counts = data.reduce((acc, current) => {
    const value = current[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const aggregateBySession = (data) =>
  aggregateDataByKey(data, "session").sort((a, b) =>
    a.name.localeCompare(b.name)
  );

const tooltipStyle = {
  borderRadius: "0.5rem",
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
};

const ChartCard = ({ title, children, className = "" }) => (
  <Card className={`${className}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[350px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const FacultyBarChart = ({ data }) => {
  const chartData = aggregateDataByKey(data, "faculty");
  return (
    <ChartCard
      title="Member Count by Faculty"
      className="xl:col-span-4 lg:col-span-2"
    >
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid stroke="var(--muted-foreground)" strokeOpacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="var(--foreground)"
          tickFormatter={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
        />
        <YAxis stroke="var(--foreground)" allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar
          dataKey="value"
          name="Members"
          radius={[4, 4, 0, 0]}
          fill="var(--chart-1)"
        />
      </BarChart>
    </ChartCard>
  );
};

const ProfessionPieChart = ({ data }) => {
  const allData = aggregateDataByKey(data, "profession");
  const topData = allData.slice(0, 5);
  const otherCount = allData.slice(5).reduce((sum, i) => sum + i.value, 0);
  if (otherCount > 0) topData.push({ name: "Other", value: otherCount });

  return (
    <ChartCard
      title="Distribution of Top Professions"
      className="xl:col-span-2"
    >
      <PieChart>
        <Pie
          data={topData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          labelLine={false}
          label={({ name, percent }) =>
            percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
          }
        >
          {topData.map((_, i) => (
            <Cell key={i} fill={chartColors[i % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "10px" }} />
      </PieChart>
    </ChartCard>
  );
};

const SessionLineChart = ({ data }) => {
  const chartData = aggregateBySession(data);
  return (
    <ChartCard title="Alumni Growth Trend by Session" className="xl:col-span-4">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid stroke="var(--muted-foreground)" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="var(--foreground)" />
        <YAxis stroke="var(--foreground)" allowDecimals={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`${v} Alumni`, "Count"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--chart-2)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartCard>
  );
};

const UpazillaRadarChart = ({ data }) => {
  const chartData = aggregateDataByKey(data, "upazilla").slice(0, 6);
  const maxValue = chartData[0]?.value || 1;

  const radarData = chartData.map((item) => ({
    subject: item.name,
    count: item.value,
    fullMark: maxValue,
  }));

  return (
    <ChartCard
      title="Regional Distribution by Upazilla"
      className="xl:col-span-2"
    >
      <RadarChart outerRadius={100} data={radarData}>
        <PolarGrid stroke="var(--muted-foreground)" strokeOpacity={0.2} />
        <PolarAngleAxis dataKey="subject" stroke="var(--foreground)" />

        <PolarRadiusAxis
          angle={90}
          domain={[0, maxValue]}
          stroke="var(--muted-foreground)"
          strokeOpacity={0.5}
          allowDecimals={false}
        />
        <Radar
          name="Members"
          dataKey="count"
          stroke="var(--chart-3)"
          fill="var(--chart-3)"
          fillOpacity={0.6}
        />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ChartCard>
  );
};

const AlumniCharts = ({ data, pending = 0 }) => {
  if (!data) {
    return (
      <div className="p-4 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px]" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">
          No data records found to build the charts.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex gap-4">
            <SquareUser />
            {data.length}
          </CardTitle>
          <CardDescription>Total Alumni</CardDescription>
        </CardHeader>
      </Card>
      <Card className=" bg-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex gap-4 text-primary-foreground">
            <UserPen />
            {pending}
          </CardTitle>
          <CardDescription className="text-primary-foreground">
            Alumni to Approve
          </CardDescription>
        </CardHeader>
      </Card>
      <FacultyBarChart data={data} />
      <ProfessionPieChart data={data} />
      <UpazillaRadarChart data={data} />
      <SessionLineChart data={data} />
    </div>
  );
};

export default AlumniCharts;
