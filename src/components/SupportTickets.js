// SupportTickets.js
import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const SupportTickets = ({ data }) => {
  if (!data || data.totalTickets === 0 || !Array.isArray(data.recentTickets)) {
    return <p>Sem tickets de suporte disponíveis</p>;
  }

  return (
    <div style={{ padding: "10px" }}>
      <Typography variant="h6">Tickets de Suporte</Typography>
      <List>
        {data.recentTickets.map((ticket, index) => (
          <ListItem key={index}>
            <ListItemText primary={ticket.message} secondary={`Status: ${ticket.status || "Aberto"}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SupportTickets;
