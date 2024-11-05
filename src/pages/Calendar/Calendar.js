import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getUserEvents, createEvent, updateEvent, deleteEvent, resetMessage } from "../../slices/calendarSlice";
import Message from "../../components/Message";

const localizer = momentLocalizer(moment);

// Estilos personalizados para diferentes tipos de eventos
const eventStyleGetter = (event) => {
  const isSelected = event.selected;
  const isPast = moment(event.end).isBefore(moment());
  const isOngoing = moment().isBetween(moment(event.start), moment(event.end));

  let style = {
    backgroundColor: '#3174ad',
    borderRadius: '5px',
    opacity: 0.8,
    color: 'white',
    border: 'none',
    display: 'block',
    padding: '2px 5px',
  };

  // Evento passado
  if (isPast) {
    style.backgroundColor = '#999999';
    style.opacity = 0.6;
  }

  // Evento em andamento
  if (isOngoing) {
    style.backgroundColor = '#28a745';
    style.opacity = 1;
    style.fontWeight = 'bold';
    style.border = '2px solid #1e7e34';
  }

  // Evento selecionado
  if (isSelected) {
    style.backgroundColor = '#007bff';
    style.opacity = 1;
    style.border = '2px solid #0056b3';
    style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
  }

  return {
    style,
    className: `event-${isPast ? 'past' : isOngoing ? 'ongoing' : 'upcoming'}`
  };
};

// Componente personalizado para o evento
const EventComponent = ({ event }) => (
  <div style={{ position: 'relative', height: '100%' }}>
    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
    {event.desc && (
      <div style={{ fontSize: '0.8em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {event.desc}
      </div>
    )}
    <div style={{ 
      position: 'absolute', 
      bottom: 0, 
      right: 2, 
      fontSize: '0.7em',
      opacity: 0.8 
    }}>
      {moment(event.start).format('HH:mm')}
    </div>
  </div>
);

const MyCalendar = () => {
  const dispatch = useDispatch();
  const { user: userAuth } = useSelector((state) => state.auth);
  const { events = [], loading, error, message } = useSelector((state) => state.calendar || { events: [] });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  useEffect(() => {
    if (userAuth?.token) {
      dispatch(getUserEvents(userAuth.token));
    }
  }, [dispatch, userAuth]);

  const openModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventDesc(event.desc);
      setEventStart(moment(event.start).format("YYYY-MM-DDTHH:mm"));
      setEventEnd(moment(event.end).format("YYYY-MM-DDTHH:mm"));
    } else {
      setSelectedEvent(null);
      setEventTitle("");
      setEventDesc("");
      setEventStart("");
      setEventEnd("");
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
    dispatch(resetMessage());
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    
    const eventData = {
      title: eventTitle,
      desc: eventDesc,
      start: new Date(eventStart).toISOString(),
      end: new Date(eventEnd).toISOString(),
    };

    try {
      if (selectedEvent) {
        await dispatch(updateEvent({ id: selectedEvent._id, ...eventData })).unwrap();
      } else {
        await dispatch(createEvent(eventData)).unwrap();
      }
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await dispatch(deleteEvent(eventId)).unwrap();
      closeModal();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Formatação dos eventos com marcação de seleção
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    title: event.title || "Sem título",
    selected: selectedEvent && selectedEvent._id === event._id
  }));

  return (
    <div className="calendar-container">
      <h1>Calendário de Eventos</h1>

      {message && <Message msg={message} type="success" />}
      {error && <Message msg={error} type="error" />}
      
      <div id="formulario">
        <Calendar
          selectable
          localizer={localizer}
          events={formattedEvents}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={(slotInfo) => {
            setEventStart(moment(slotInfo.start).format("YYYY-MM-DDTHH:mm"));
            setEventEnd(moment(slotInfo.end).format("YYYY-MM-DDTHH:mm"));
            openModal();
          }}
          onSelectEvent={(event) => openModal(event)}
          views={["month", "week", "day"]}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent
          }}
          popup
          tooltipAccessor={(event) => event.desc}
        />
      </div>

      {/* Modal (mesmo código anterior) */}
      {modalIsOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <h2>{selectedEvent ? "Editar Evento" : "Novo Evento"}</h2>
            <form onSubmit={handleSubmitEvent}>
              <div className="form-group">
                <label htmlFor="eventTitle">Título</label>
                <input
                  id="eventTitle"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventDesc">Descrição</label>
                <input
                  id="eventDesc"
                  type="text"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventStart">Início</label>
                <input
                  id="eventStart"
                  type="datetime-local"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventEnd">Término</label>
                <input
                  id="eventEnd"
                  type="datetime-local"
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                </button>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent._id)}
                    disabled={loading}
                    className="delete-button"
                  >
                    Excluir Evento
                  </button>
                )}
                <button type="button" onClick={closeModal} className="cancel-button">
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