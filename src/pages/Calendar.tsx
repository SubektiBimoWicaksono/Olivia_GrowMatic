import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { Droplet, Fan, Zap, Clock, Calendar, Power, RefreshCw } from "lucide-react";

interface IoTEvent extends EventInput {
  extendedProps: {
    deviceType: "pump" | "fan" | "sensor";
    status: "on" | "off";
    duration: number;
    triggeredBy: "auto" | "manual";
    temp?: number;
    humidity?: number;
    notes?: string;
  };
}

const MushroomFarmCalendar: React.FC = () => {
  const [events, setEvents] = useState<IoTEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IoTEvent | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Load dummy data saat pertama render
  useEffect(() => {
    const today = new Date();
    const dummyEvents: IoTEvent[] = [
      {
        id: "pump1",
        title: "Pump ON (Auto)",
        start: new Date(today.setHours(8, 0, 0)).toISOString(),
        end: new Date(today.setHours(8, 30, 0)).toISOString(),
        extendedProps: {
          deviceType: "pump",
          status: "on",
          duration: 30,
          triggeredBy: "auto",
          humidity: 85,
          notes: "Automatic watering cycle"
        }
      },
      {
        id: "fan1",
        title: "Fan ON (Auto)",
        start: new Date(today.setHours(10, 0, 0)).toISOString(),
        end: new Date(today.setHours(11, 0, 0)).toISOString(),
        extendedProps: {
          deviceType: "fan",
          status: "on",
          duration: 60,
          triggeredBy: "auto",
          temp: 24,
          notes: "Ventilation cycle - temperature control"
        }
      }
    ];
    setEvents(dummyEvents);
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event as unknown as IoTEvent;
    setSelectedEvent(event);
    openModal();
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
      </div>

      {/* Modal Detail Event */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        {selectedEvent && (
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              {selectedEvent.extendedProps.deviceType === "pump" ? (
                <Droplet className="text-blue-500" />
              ) : (
                <Fan className="text-green-500" />
              )}
              {selectedEvent.title}
            </h3>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" size={18} />
                <span>
                  {new Date(selectedEvent.start as string).toLocaleDateString()} •{' '}
                  {new Date(selectedEvent.start as string).toLocaleTimeString()} -{' '}
                  {new Date(selectedEvent.end as string).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Power className="text-gray-500" size={18} />
                <span>Status: {selectedEvent.extendedProps.status.toUpperCase()}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <RefreshCw className="text-gray-500" size={18} />
                <span>Duration: {selectedEvent.extendedProps.duration} minutes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Zap className="text-gray-500" size={18} />
                <span>Trigger: {selectedEvent.extendedProps.triggeredBy}</span>
              </div>
              
              {selectedEvent.extendedProps.temp && (
                <div className="flex items-center gap-3">
                  <Thermometer className="text-gray-500" size={18} />
                  <span>Temperature: {selectedEvent.extendedProps.temp}°C</span>
                </div>
              )}
              
              {selectedEvent.extendedProps.humidity && (
                <div className="flex items-center gap-3">
                  <Droplet className="text-gray-500" size={18} />
                  <span>Humidity: {selectedEvent.extendedProps.humidity}%</span>
                </div>
              )}
              
              {selectedEvent.extendedProps.notes && (
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedEvent.extendedProps.notes}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const { deviceType, status } = eventInfo.event.extendedProps;
  
  const getEventStyles = () => {
    const base = "p-2 rounded-md flex items-start gap-2 text-sm";
    if (deviceType === "pump") {
      return `${base} ${status === "on" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`;
    } else if (deviceType === "fan") {
      return `${base} ${status === "on" ? "bg-green-100 text-green-800" : "bg-gray-100"}`;
    }
    return `${base} bg-purple-100`;
  };

  return (
    <div className={getEventStyles()}>
      {deviceType === "pump" ? (
        <Droplet className="w-4 h-4 mt-0.5" />
      ) : (
        <Fan className="w-4 h-4 mt-0.5" />
      )}
      <div>
        <div className="font-medium">
          {eventInfo.event.title}
        </div>
        <div className="text-xs">
          {eventInfo.timeText}
        </div>
      </div>
    </div>
  );
};

export default MushroomFarmCalendar;