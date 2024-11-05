import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, MenuItem, Typography } from "@mui/material";
import dayjs from "dayjs";

const PostsChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState("Todos");
  const [filteredData, setFilteredData] = useState([]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  useEffect(() => {
    const filterDataByTimeRange = () => {
      const now = dayjs();
      let startDate;

      if (timeRange === "Última Semana") {
        startDate = now.subtract(1, "week");
      } else if (timeRange === "Último Mês") {
        startDate = now.subtract(1, "month");
      } else if (timeRange === "Último Trimestre") {
        startDate = now.subtract(3, "month");
      } else {
        // Se "Todos" estiver selecionado, mantenha todos os dados
        setFilteredData([
          { name: "Total de Posts", value: data.totalPosts },
          { name: "Total de Curtidas", value: data.totalLikes },
          { name: "Total de Comentários", value: data.totalComments },
        ]);
        return;
      }

      // Aqui, filtramos apenas as métricas que têm uma data associada dentro do intervalo (ajuste conforme necessário)
      const filtered = [
        { name: "Total de Posts", value: data.totalPosts }, // Ajuste para adicionar a lógica de tempo
        { name: "Total de Curtidas", value: data.totalLikes }, // Ajuste para adicionar a lógica de tempo
        { name: "Total de Comentários", value: data.totalComments }, // Ajuste para adicionar a lógica de tempo
      ];
      setFilteredData(filtered);
    };

    filterDataByTimeRange();
  }, [timeRange, data]);

  return (
    <div>
      <Typography variant="h6">Métricas de Interações</Typography>

      <Select value={timeRange} onChange={handleTimeRangeChange} displayEmpty>
        <MenuItem value="Todos">Todos</MenuItem>
        <MenuItem value="Última Semana">Última Semana</MenuItem>
        <MenuItem value="Último Mês">Último Mês</MenuItem>
        <MenuItem value="Último Trimestre">Último Trimestre</MenuItem>
      </Select>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Métricas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostsChart;
