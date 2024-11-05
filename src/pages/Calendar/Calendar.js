import "./Calendar.css";
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

  const dayPropGetter = (date) => {
    const isEventDay = events.some(
      (event) => moment(event.start).isSame(date, "day")
    );
    return {
      className: isEventDay ? "event-day" : ""
    };
  };

  return (
    <div id="formulario">
      <h1>Calendário de Eventos</h1>

      {message && <Message msg={message} type="success" />}
      {error && <Message msg={error} type="error" />}
      
      <Calendar
        selectable
        localizer={localizer}
        events={events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          title: event.title || "Sem título",
          selected: selectedEvent && selectedEvent._id === event._id
        }))}
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
        dayPropGetter={dayPropGetter}
      />

      {/* Modal */}
      {modalIsOpen && (
        <div className="modal-overlay">
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
                <button type="submit" disabled={loading} className="btn">
                  {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                </button>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => dispatch(deleteEvent(selectedEvent._id)).then(closeModal)}
                    disabled={loading}
                    className="delete-button"
                  >
                    Excluir Evento
                  </button>
                )}
                <button type="button" onClick={closeModal} className="btn-cancel">
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
