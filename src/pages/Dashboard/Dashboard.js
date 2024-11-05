import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import PostsChart from "../../components/PostsChart";
import ApplicationsChart from "../../components/ApplicationChart";
import SupportTickets from "../../components/SupportTickets";
import EarningsProjectionChart from "../../components/EarningsProjectionChart"; // Adicione esta linha


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    postsData: {},
    applicationsData: {},
    eventsData: {},
    supportData: {},
  });

  // Funções de busca de dados
  const fetchPostsData = async () => {
    try {
      const response = await fetch("/api/dashboard/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de posts:", error);
      return {};
    }
  };

  const fetchApplicationsData = async () => {
    try {
      const response = await fetch("/api/dashboard/applications", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados de vagas aplicadas:", error);
      return {};
    }
  };

  const fetchSupportData = async () => {
    try {
      const response = await fetch("/api/dashboard/support", {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const supportData = await response.json();
      console.log("Dados de suporte recebidos:", supportData); // Log para depuração
      return supportData;
    } catch (error) {
      console.error("Erro ao buscar dados de suporte:", error);
      return { totalTickets: 0, recentTickets: [] };
    }
  };

  const fetchEarningsProjectionData = async () => {
    try {
      const response = await fetch("/api/dashboard/earningsProjection", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar projeção de ganhos:", error);
      return { totalProjectedEarnings: 0, campaigns: [] };
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const postsData = await fetchPostsData();
      const applicationsData = await fetchApplicationsData();
      const supportData = await fetchSupportData();
      const earningsProjectionData = await fetchEarningsProjectionData(); 


      setDashboardData({
        postsData,
        applicationsData,
        supportData,
        earningsProjectionData, 
      });
    };

    fetchData();
  }, [user.token]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard do Influenciador
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper>
            <PostsChart data={dashboardData.postsData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper>
            <ApplicationsChart data={dashboardData.applicationsData} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper>
            <SupportTickets data={dashboardData.supportData} />
          </Paper>
        </Grid>
      </Grid>

        <Grid item xs={12} lg={6}>
            <Paper>
            <EarningsProjectionChart data={dashboardData.earningsProjectionData} />
            </Paper>
        </Grid>
      
    </Container>
    
  );
};

export default Dashboard;
