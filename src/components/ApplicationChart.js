import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Typography} from "@mui/material";


const COLORS = ["#0088FE", "#00C49F"];

const ApplicationsChart = ({ data }) => {
  if (!data || !data.totalApplications) {
    return <p>Sem dados disponíveis</p>;
  }

  const chartData = [
    { name: "Inscrições Ativas", value: data.activeApplications },
    { name: "Total de Inscrições", value: data.totalApplications - data.activeApplications }
  ];

  return (
    <div>
      <Typography variant="h6">Vagas Inscritas</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationsChart;
