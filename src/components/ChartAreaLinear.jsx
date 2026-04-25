import React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "ECE", value: 186 },
  { month: "CSE", value: 305 },
  { month: "IT", value: 237 },
  { month: "MECH", value: 73 },
  { month: "EEE", value: 209 },
  { month: "AI", value: 214 },
];

export function ChartAreaLinear() {
  return (
    <div className="flex flex-col w-full h-full ">
      

      <div className="p-6 pt-0 mt-4 h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3"/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#000000', fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              dataKey="value"
              type="linear"
              fill="#d2fadd"
              fillOpacity={0.4}
              stroke="#709e7d"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartAreaLinear;
