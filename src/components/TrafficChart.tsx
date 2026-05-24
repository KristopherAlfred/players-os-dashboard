import { useTheme } from "../theme/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./ui/Card";
import { trafficOverTime } from "../data/mockData";

export function TrafficChart() {
  const { palette } = useTheme();
  return (
    <Card title="Traffic Over Time" className="h-[280px]">
      <div className="h-[230px] px-2 pb-2 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trafficOverTime}>
            <CartesianGrid stroke="#1e1e1e" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b6b6b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b6b6b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke={palette.accent}
              strokeWidth={2}
              dot={{ fill: palette.accent, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
