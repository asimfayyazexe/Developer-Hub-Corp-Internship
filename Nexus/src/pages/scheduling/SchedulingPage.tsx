import React, { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Send,
  XCircle,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { availabilitySlots, meetingRequests } from '../../data/collaborationHub';
import { findUserById, getUsersByRole } from '../../data/users';
import { AvailabilitySlot, MeetingRequest } from '../../types';

const statusVariant = {
  pending: 'warning',
  accepted: 'success',
  declined: 'error',
} as const;

export const SchedulingPage: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<AvailabilitySlot[]>(availabilitySlots);
  const [requests, setRequests] = useState<MeetingRequest[]>(meetingRequests);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotForm, setSlotForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '09:30',
    label: 'Intro call',
    mode: 'Video' as AvailabilitySlot['mode'],
  });
  const [requestForm, setRequestForm] = useState({
    recipientId: '',
    title: 'Investment discussion',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '10:30',
    note: '',
  });

  const partnerRole = user?.role === 'investor' ? 'entrepreneur' : 'investor';
  const partners = useMemo(() => getUsersByRole(partnerRole), [partnerRole]);

  if (!user) return null;

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const userSlots = slots.filter((slot) => slot.userId === user.id);
  const selectedSlots = userSlots.filter((slot) => slot.date === selectedDateKey);
  const selectedMeetings = requests.filter(
    (request) =>
      request.date === selectedDateKey &&
      [request.requesterId, request.recipientId].includes(user.id)
  );
  const incomingRequests = requests.filter(
    (request) => request.recipientId === user.id && request.status === 'pending'
  );
  const outgoingRequests = requests.filter((request) => request.requesterId === user.id);
  const confirmedMeetings = requests
    .filter(
      (request) =>
        request.status === 'accepted' &&
        [request.requesterId, request.recipientId].includes(user.id)
    )
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));

  const partnerName = (userId: string) => findUserById(userId)?.name ?? 'Nexus member';

  const handleSlotSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingSlotId) {
      setSlots((currentSlots) =>
        currentSlots.map((slot) =>
          slot.id === editingSlotId
            ? {
                ...slot,
                ...slotForm,
              }
            : slot
        )
      );
      setEditingSlotId(null);
      return;
    }

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      userId: user.id,
      ...slotForm,
    };
    setSlots((currentSlots) => [newSlot, ...currentSlots]);
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlotId(slot.id);
    setSlotForm({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      label: slot.label,
      mode: slot.mode,
    });
  };

  const handleRequestSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const recipientId = requestForm.recipientId || partners[0]?.id;
    if (!recipientId) return;

    const newRequest: MeetingRequest = {
      id: `meet-${Date.now()}`,
      requesterId: user.id,
      recipientId,
      title: requestForm.title,
      date: requestForm.date,
      startTime: requestForm.startTime,
      endTime: requestForm.endTime,
      note: requestForm.note,
      status: 'pending',
    };

    setRequests((currentRequests) => [newRequest, ...currentRequests]);
    setRequestForm((currentForm) => ({
      ...currentForm,
      note: '',
    }));
  };

  const updateRequestStatus = (requestId: string, status: MeetingRequest['status']) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
            }
          : request
      )
    );
  };

  const getDayActivity = (day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return {
      slots: userSlots.filter((slot) => slot.date === dayKey).length,
      meetings: requests.filter(
        (request) =>
          request.date === dayKey &&
          [request.requesterId, request.recipientId].includes(user.id)
      ).length,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Calendar</h1>
          <p className="text-gray-600">Coordinate availability and meeting requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Clock size={18} />}>
            {incomingRequests.length} pending
          </Button>
          <Button leftIcon={<CalendarDays size={18} />}>
            {confirmedMeetings.length} confirmed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-gray-500">
                {format(selectedDate, 'EEEE, MMMM d')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                aria-label="Previous month"
                className="p-2"
                size="sm"
                variant="ghost"
                onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                aria-label="Next month"
                className="p-2"
                size="sm"
                variant="ghost"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-gray-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const activity = getDayActivity(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day);
                      setSlotForm((currentForm) => ({
                        ...currentForm,
                        date: format(day, 'yyyy-MM-dd'),
                      }));
                      setRequestForm((currentForm) => ({
                        ...currentForm,
                        date: format(day, 'yyyy-MM-dd'),
                      }));
                    }}
                    className={`min-h-24 rounded-md border p-2 text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                    } ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    <span className="text-sm font-semibold">{format(day, 'd')}</span>
                    <div className="mt-3 space-y-1">
                      {activity.slots > 0 && (
                        <span className="block rounded bg-secondary-50 px-2 py-1 text-xs font-medium text-secondary-700">
                          {activity.slots} slot{activity.slots === 1 ? '' : 's'}
                        </span>
                      )}
                      {activity.meetings > 0 && (
                        <span className="block rounded bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                          {activity.meetings} meeting{activity.meetings === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                {editingSlotId ? 'Modify availability' : 'Add availability'}
              </h2>
            </CardHeader>
            <CardBody>
              <form className="space-y-4" onSubmit={handleSlotSubmit}>
                <Input
                  label="Date"
                  type="date"
                  value={slotForm.date}
                  onChange={(event) =>
                    setSlotForm((currentForm) => ({ ...currentForm, date: event.target.value }))
                  }
                  fullWidth
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start"
                    type="time"
                    value={slotForm.startTime}
                    onChange={(event) =>
                      setSlotForm((currentForm) => ({
                        ...currentForm,
                        startTime: event.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <Input
                    label="End"
                    type="time"
                    value={slotForm.endTime}
                    onChange={(event) =>
                      setSlotForm((currentForm) => ({ ...currentForm, endTime: event.target.value }))
                    }
                    fullWidth
                  />
                </div>
                <Input
                  label="Label"
                  value={slotForm.label}
                  onChange={(event) =>
                    setSlotForm((currentForm) => ({ ...currentForm, label: event.target.value }))
                  }
                  fullWidth
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Mode</label>
                  <select
                    value={slotForm.mode}
                    onChange={(event) =>
                      setSlotForm((currentForm) => ({
                        ...currentForm,
                        mode: event.target.value as AvailabilitySlot['mode'],
                      }))
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option>Video</option>
                    <option>Phone</option>
                    <option>In person</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" fullWidth>
                    {editingSlotId ? 'Save slot' : 'Add slot'}
                  </Button>
                  {editingSlotId && (
                    <Button
                      type="button"
                      fullWidth
                      variant="outline"
                      onClick={() => setEditingSlotId(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Selected day</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
                <div className="mt-2 space-y-2">
                  {selectedSlots.length > 0 ? (
                    selectedSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between rounded-md border border-gray-200 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{slot.label}</p>
                          <p className="text-xs text-gray-500">
                            {slot.startTime} - {slot.endTime} - {slot.mode}
                          </p>
                        </div>
                        <Button
                          aria-label="Edit availability"
                          className="p-2"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditSlot(slot)}
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No availability slots.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">Meetings</h3>
                <div className="mt-2 space-y-2">
                  {selectedMeetings.length > 0 ? (
                    selectedMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="rounded-md border border-gray-200 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                          <Badge variant={statusVariant[meeting.status]} size="sm">
                            {meeting.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {meeting.startTime} - {meeting.endTime} -{' '}
                          {partnerName(
                            meeting.requesterId === user.id
                              ? meeting.recipientId
                              : meeting.requesterId
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No meeting activity.</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Send meeting request</h2>
          </CardHeader>
          <CardBody>
            <form className="space-y-4" onSubmit={handleRequestSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Recipient</label>
                <select
                  value={requestForm.recipientId}
                  onChange={(event) =>
                    setRequestForm((currentForm) => ({
                      ...currentForm,
                      recipientId: event.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Title"
                value={requestForm.title}
                onChange={(event) =>
                  setRequestForm((currentForm) => ({ ...currentForm, title: event.target.value }))
                }
                fullWidth
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  label="Date"
                  type="date"
                  value={requestForm.date}
                  onChange={(event) =>
                    setRequestForm((currentForm) => ({ ...currentForm, date: event.target.value }))
                  }
                  fullWidth
                />
                <Input
                  label="Start"
                  type="time"
                  value={requestForm.startTime}
                  onChange={(event) =>
                    setRequestForm((currentForm) => ({
                      ...currentForm,
                      startTime: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <Input
                  label="End"
                  type="time"
                  value={requestForm.endTime}
                  onChange={(event) =>
                    setRequestForm((currentForm) => ({ ...currentForm, endTime: event.target.value }))
                  }
                  fullWidth
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  value={requestForm.note}
                  onChange={(event) =>
                    setRequestForm((currentForm) => ({ ...currentForm, note: event.target.value }))
                  }
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <Button type="submit" leftIcon={<Send size={18} />}>
                Send request
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Meeting requests</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((request) => (
                <div key={request.id} className="rounded-md border border-gray-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{request.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {partnerName(request.requesterId)} -{' '}
                        {format(parseISO(request.date), 'MMM d')} - {request.startTime} -{' '}
                        {request.endTime}
                      </p>
                      {request.note && (
                        <p className="mt-2 text-sm text-gray-600">{request.note}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label="Accept meeting request"
                        className="p-2"
                        size="sm"
                        variant="success"
                        onClick={() => updateRequestStatus(request.id, 'accepted')}
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button
                        aria-label="Decline meeting request"
                        className="p-2"
                        size="sm"
                        variant="error"
                        onClick={() => updateRequestStatus(request.id, 'declined')}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending inbound requests.</p>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900">Outgoing</h3>
              <div className="mt-2 space-y-2">
                {outgoingRequests.slice(0, 4).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.title}</p>
                      <p className="text-xs text-gray-500">
                        {partnerName(request.recipientId)} - {request.date}
                      </p>
                    </div>
                    <Badge variant={statusVariant[request.status]} size="sm">
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
