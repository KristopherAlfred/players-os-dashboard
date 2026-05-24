import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/Card";
import { trafficSources } from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

export function TrafficSourcesChart() {
  const { palette } = useTheme();

  return (
    <Card title="Top Traffic Sources" className="h-[280px]">
      <div className="flex h-[230px] flex-col items-center px-4 pb-2">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={trafficSources}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={2}
              dataKey="value"
            >
              {trafficSources.map((entry, i) => (
                <Cell key={entry.name} fill={palette.trafficShades[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Share"]}
              contentStyle={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="mt-1 grid w-full grid-cols-2 gap-x-2 gap-y-1">
          {trafficSources.map((s, i) => (
            <li
              key={s.name}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="flex items-center gap-1.5 text-[#a3a3a3]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: palette.trafficShades[i] }}
                />
                {s.name}
              </span>
              <span className="font-medium text-white">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
