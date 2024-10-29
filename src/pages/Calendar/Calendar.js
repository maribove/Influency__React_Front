import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getUserEvents, createEvent, updateEvent, deleteEvent, resetMessage } from "../../slices/calendarSlice";
import Message from "../../components/Message";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const dispatch = useDispatch();
  const { user: userAuth } = useSelector((state) => state.auth);
  const { events, loading, error, message } = useSelector((state) => state.calendar || {});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");

  // Função para carregar eventos e converter as datas para strings ISO
  useEffect(() => {
    if (userAuth && userAuth.token) {
      dispatch(getUserEvents(userAuth.token)).then((response) => {
        if (response.payload) {
          const eventsWithISOStrings = response.payload.map(event => ({
            ...event,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString()
          }));
          dispatch({ type: 'calendar/setEvents', payload: eventsWithISOStrings });
        }
      });
    }
  }, [dispatch, userAuth]);

  // abrir o modal
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

  // Função para fechar o modal
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(resetMessage());
  };

  // Função para criar ou editar um evento
  const handleSubmitEvent = () => {
    const newEvent = {
      title: eventTitle,
      desc: eventDesc,
      start: eventStart,
      end: eventEnd,
    };

    if (selectedEvent) {
      newEvent.id = selectedEvent._id;
      dispatch(updateEvent(newEvent));
    } else {
      dispatch(createEvent(newEvent));
    }
  };

  // Função para excluir evento
  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
    closeModal();
  };

  // Converte strings ISO de volta para objetos `Date` ao renderizar
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }));

  return (
    <div>
      <h1>Calendário de Eventos</h1>

      {message && <Message msg={message} type="success" />}
      {error && <Message msg={error} type="error" />}
      
      <div id="formulario" style={{ height: "500pt", margin: "50px" }}>
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
                <button type="button" onClick={handleSubmitEvent} disabled={loading}>
                  {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                </button>
                {selectedEvent && (
                  <button type="button" onClick={() => handleDeleteEvent(selectedEvent._id)} disabled={loading}>
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
