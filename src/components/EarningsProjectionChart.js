// EarningsProjectionChart.js

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

const EarningsProjectionChart = ({ data }) => {
  if (!data || !data.campaigns) return <p>Sem dados de projeção de ganhos.</p>;

  const chartData = data.campaigns.map(campaign => ({
    month: dayjs(campaign.appliedAt).format("YYYY-MM"),
    valor: campaign.valor,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6">Projeção de Ganhos Potenciais</Typography>
      <Typography variant="body1">Total Potencial: R$ {data.totalProjectedEarnings.toFixed(2)}</Typography>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `R$${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="valor" stroke="#8884d8" name="Ganhos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsProjectionChart;
