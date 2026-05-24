import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "./ui/Card";
import { deviceBreakdown } from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

export function DeviceBreakdown() {
  const { palette } = useTheme();
  const COLORS = [palette.accent, palette.chartSecondary, palette.chartTertiary];

  return (
    <Card title="Device Breakdown" className="h-[260px]">
      <div className="flex flex-col items-center px-4 pb-3">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={deviceBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={52}
              dataKey="value"
              paddingAngle={2}
            >
              {deviceBreakdown.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ul className="mt-2 w-full space-y-1.5">
          {deviceBreakdown.map((d, i) => (
            <li
              key={d.name}
              className="flex justify-between text-[12px]"
            >
              <span className="flex items-center gap-2 text-[#a3a3a3]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: COLORS[i] }}
                />
                {d.name}
              </span>
              <span className="font-medium text-white">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
