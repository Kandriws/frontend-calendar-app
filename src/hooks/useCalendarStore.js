import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../api";
import { convertToDateEvent } from "../helpers";
import toast from "react-hot-toast";


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { user } = useSelector((state) => state.auth);

    const hasEventSelected = !!activeEvent;

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (!calendarEvent.id) {

                const { data } = await calendarApi.post('/events', calendarEvent);

                dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));

                return;
            }


            await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);

            dispatch(onUpdateEvent({ ...calendarEvent, user }));
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');

            const events = convertToDateEvent(data.events);

            dispatch(onLoadEvents(events));
        } catch (error) {
            console.log(error);
        }
    }

    const startDeletingEvent = async () => {
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    return {
        //Props
        events,
        activeEvent,
        hasEventSelected,

        //Methods
        setActiveEvent,
        startDeletingEvent,
        startLoadingEvents,
        startSavingEvent,

    };
};