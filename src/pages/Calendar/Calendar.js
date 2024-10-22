import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const { user: userAuth } = useSelector((state) => state.auth); // Usuário autenticado
  const [events, setEvents] = useState([]); // Eventos no calendário
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento selecionado para editar
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar o modal

  // Campos do evento
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // Função para carregar eventos do backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events", {
          headers: {
            Authorization: `Bearer ${userAuth.token}`, // Enviar o token do usuário autenticado
          },
        });
        setEvents(res.data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      }
    };
    fetchEvents();
  }, [userAuth]);

  // Função para abrir o modal
  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventDesc(event.desc);
      setEventStart(event.start);
      setEventEnd(event.end);
    } else {
      setSelectedEvent(null);
      setEventTitle("");
      setEventDesc("");
      setEventStart("");
      setEventEnd("");
    }
    setModalIsOpen(true); // Abre o modal
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Função para criar ou editar um evento
  const handleSubmitEvent = async () => {
    const newEvent = {
      title: eventTitle,
      desc: eventDesc,
      start: eventStart,
      end: eventEnd,
    };

    try {
      if (selectedEvent) {
        // Editar evento
        await axios.put(`/api/events/${selectedEvent._id}`, newEvent, {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        });
        setEvents(events.map((event) => (event._id === selectedEvent._id ? newEvent : event)));
      } else {
        // Criar novo evento
        const response = await axios.post("/api/events", newEvent, {
          headers: {
            Authorization: `Bearer ${userAuth.token}`,
          },
        });
        setEvents([...events, response.data]); // Adicionar novo evento à lista
      }
      closeModal(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao salvar o evento:", error);
    }
  };

  // Função para excluir evento
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      });
      setEvents(events.filter((event) => event._id !== eventId)); // Remover evento localmente
    } catch (error) {
      console.error("Erro ao excluir o evento:", error);
    }
  };

  return (
    <div>
      <h1>Calendário de Eventos</h1>
      <div style={{ height: "500pt", margin: "50px" }}>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slotInfo) => {
            setEventStart(slotInfo.start);
            setEventEnd(slotInfo.end);
            openModal(); // Abre o modal para criar novo evento
          }}
          onSelectEvent={(event) => openModal(event)} // Abre o modal para editar evento
          views={["month", "week", "day"]}
        />
      </div>

      {/* Modal personalizado */}
      {modalIsOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <h2>{selectedEvent ? "Editar Evento" : "Novo Evento"}</h2>
            <form>
              <label>Título</label>
              <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />

              <label>Descrição</label>
              <input type="text" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />

              <label>Início</label>
              <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} />

              <label>Término</label>
              <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} />

              <div className="modal-buttons">
                <button type="button" onClick={handleSubmitEvent}>
                  {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                </button>
                {selectedEvent && (
                  <button type="button" onClick={() => handleDeleteEvent(selectedEvent._id)}>
                    Excluir Evento
                  </button>
                )}
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
