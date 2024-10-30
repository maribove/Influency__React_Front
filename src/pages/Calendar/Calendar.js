import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { createEvent, getUserEvents, updateEvent, deleteEvent } from "../../slices/calendarSlice";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const dispatch = useDispatch();
  const { user: userAuth } = useSelector((state) => state.auth);
  const { events, loading } = useSelector((state) => state.calendar);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Campos do evento
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // Carregar eventos
  useEffect(() => {
    dispatch(getUserEvents());
  }, [dispatch]);

  // Função para formatar data para o formato esperado pelo backend
  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  // Função para abrir o modal
  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventDesc(event.desc);
      setEventStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
      setEventEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
    } else {
      setSelectedEvent(null);
      setEventTitle("");
      setEventDesc("");
      setEventStart("");
      setEventEnd("");
    }
    setModalIsOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  // Função para criar ou editar um evento
  const handleSubmitEvent = async () => {
    const eventData = {
      title: eventTitle,
      desc: eventDesc,
      start: formatDate(eventStart),
      end: formatDate(eventEnd),
    };

    if (selectedEvent) {
      // Editar evento
      dispatch(updateEvent({ ...eventData, id: selectedEvent._id }));
    } else {
      // Criar novo evento
      dispatch(createEvent(eventData));
    }
    
    closeModal();
  };

  // Função para excluir evento
  const handleDeleteEvent = async (eventId) => {
    dispatch(deleteEvent(eventId));
    closeModal();
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div id="formulario">
      <h1>Calendário de Eventos</h1>
      <div style={{ height: "500pt", margin: "50px" }}>
        <Calendar
          selectable
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          }))}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slotInfo) => {
            setEventStart(moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'));
            setEventEnd(moment(slotInfo.end).format('YYYY-MM-DDTHH:mm'));
            openModal();
          }}
          onSelectEvent={(event) => openModal(event)}
          views={["month", "week", "day"]}
        />
      </div>

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
              <input 
                type="datetime-local" 
                value={eventStart} 
                onChange={(e) => setEventStart(e.target.value)} 
              />

              <label>Término</label>
              <input 
                type="datetime-local" 
                value={eventEnd} 
                onChange={(e) => setEventEnd(e.target.value)} 
              />

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