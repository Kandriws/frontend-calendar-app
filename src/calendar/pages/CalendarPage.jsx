import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addHours } from 'date-fns';
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar } from "../";
import { getMessagesES, localizer } from '../../helpers';
import { useEffect, useState } from 'react';
import { useUiStore, useCalendarStore } from '../../hooks';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../hooks/useAuthStore';

export const CalendarPage = () => {

    const { user } = useAuthStore();

    const { openDateModal } = useUiStore();

    const { events, setActiveEvent, startLoadingEvents, activeEvent } = useCalendarStore();

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const eventStyleGetter = (event, start, end, isSelected) => {

        const isOwner = user.uid === event.user._id || user.uid === event.user.uid;

        const style = {
            backgroundColor: isOwner ? '#367CF7' : '#a1a1a1',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }
        return { style }
    };

    const onDoubleClick = (event) => {
        openDateModal();
    }

    const onSelectEvent = (event) => {
        const isOwner = user.uid === event.user._id || user.uid === event.user.uid;
        if (!isOwner) return setActiveEvent(null);
        setActiveEvent(event);
    }

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    }

    const onSelecting = (event) => {
        console.log(event);
    }

    useEffect(() => {
        startLoadingEvents();
    }, []);


    return (
        <>
            <NavBar />
            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "calc(100vh - 80px)" }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onSelecting={onSelecting}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
            <Toaster />
        </>
    )
}
