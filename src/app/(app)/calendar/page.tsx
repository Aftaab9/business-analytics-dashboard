
'use client';

import type {Appointment} from '@/types';
import {useAuth} from '@/components/auth/auth-provider';
import type {DraftMeetingEmailOutput} from '@/types/meeting-scheduler';
import {draftMeetingEmail} from '@/ai/flows/meeting-scheduler-flow';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Calendar} from '@/components/ui/calendar';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {format, parseISO} from 'date-fns';
import {
  AlertCircle,
  BrainCircuit,
  CalendarDays,
  Clock,
  Loader2,
  Mail,
  PlusCircle,
  Video,
} from 'lucide-react';
import {useMemo, useState, useEffect} from 'react';

import {getAppointmentsForRole} from '@/lib/placeholder-data';

// Helper functions for localStorage
const getStoredAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('insightFlowDynamicAppointments');
  return stored ? JSON.parse(stored) : [];
};

const setStoredAppointments = (appointments: Appointment[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('insightFlowDynamicAppointments', JSON.stringify(appointments));
};


export default function CalendarPage() {
  const {user, specificRole} = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // State for the AI scheduler
  const {toast} = useToast();
  const [userPrompt, setUserPrompt] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] =
    useState<DraftMeetingEmailOutput | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [dynamicAppointments, setDynamicAppointments] = useState<Appointment[]>(
    []
  );
  
  useEffect(() => {
    setDynamicAppointments(getStoredAppointments());
  }, []);

  // Get appointments based on the user's role and combine with dynamic ones
  const mockAppointments = useMemo(
    () => getAppointmentsForRole(specificRole),
    [specificRole]
  );
  const allAppointments = useMemo(
    () => [...mockAppointments, ...dynamicAppointments],
    [mockAppointments, dynamicAppointments]
  );

  const appointmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return allAppointments.filter(appt => appt.date === dateString);
  }, [selectedDate, allAppointments]);

  const eventDays = allAppointments
    .map(appt => {
      try {
        return parseISO(appt.date);
      } catch (e) {
        console.error(
          `Invalid date format for appointment: ${appt.title}`,
          appt.date
        );
        return null;
      }
    })
    .filter(date => date !== null) as Date[];

  const modifiers = {
    event: eventDays,
  };

  const modifiersStyles = {
    event: {
      border: '2px solid hsl(var(--primary))',
      borderRadius: '50%',
    },
  };

  const handleScheduleSubmit = async () => {
    if (!userPrompt || !user) return;
    setIsScheduling(true);
    setScheduleError(null);
    setScheduleResult(null);

    try {
      const result = await draftMeetingEmail({
        userPrompt,
        senderName: user.username,
      });
      setScheduleResult(result);

      const newAppointment: Appointment = {
        id: `dyn-${Date.now()}`,
        title: result.appointmentTitle,
        date: result.appointmentDate,
        time: result.appointmentTime,
        description: `Meeting with ${result.recipientEmail}. Link: ${result.meetingLink}`,
      };
      
      const updatedAppointments = [...dynamicAppointments, newAppointment];
      setDynamicAppointments(updatedAppointments);
      setStoredAppointments(updatedAppointments);


      toast({
        title: 'Meeting Drafted!',
        description: `Appointment with ${result.recipientEmail} has been added to your calendar.`,
      });
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred.';
      setScheduleError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Scheduling Error',
        description: errorMessage,
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-foreground">
            Appointment Calendar
          </h2>
          <p className="text-muted-foreground">
            Manage your schedule and appointments.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            AI Meeting Scheduler
          </CardTitle>
          <CardDescription>
            Describe the meeting you want to schedule, and the AI will draft the
            email and create the calendar event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., Draft an email to jane.doe@example.com to schedule a meeting next Tuesday morning to discuss the Q3 marketing budget."
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
            className="min-h-[100px]"
            disabled={isScheduling}
          />
          <Button
            onClick={handleScheduleSubmit}
            disabled={isScheduling || !userPrompt}
          >
            {isScheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                {' '}
                <PlusCircle className="mr-2 h-4 w-4" /> Schedule Meeting
              </>
            )}
          </Button>

          {scheduleError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{scheduleError}</AlertDescription>
            </Alert>
          )}

          {scheduleResult && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">AI Generated Draft</h3>
              <Card>
                <CardHeader className="bg-muted/50 p-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email to: {scheduleResult.recipientEmail}
                  </CardTitle>
                  <p className="text-sm font-normal text-muted-foreground">
                    Subject: {scheduleResult.subject}
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="whitespace-pre-wrap">{scheduleResult.body}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-muted/50 p-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Calendar Event Created
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <p>
                    <strong>Title:</strong> {scheduleResult.appointmentTitle}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{' '}
                    {format(parseISO(scheduleResult.appointmentDate), 'PPP')} at{' '}
                    {scheduleResult.appointmentTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Link:</strong>
                    <a
                      href={scheduleResult.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Video className="h-4 w-4" />
                      Join Meeting
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Monthly
              View
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              initialFocus
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Appointments for{' '}
              {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsForSelectedDate.length > 0 ? (
              <ul className="space-y-3">
                {appointmentsForSelectedDate.map((appt: Appointment) => (
                  <li
                    key={appt.id}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <h4 className="font-semibold text-foreground">
                      {appt.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {appt.time}
                    </p>
                    {appt.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {appt.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No appointments for this date.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Upcoming Appointments (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {allAppointments
              .filter(appt => {
                try {
                    const apptDate = parseISO(appt.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const sevenDaysFromNow = new Date();
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    return apptDate >= today && apptDate <= sevenDaysFromNow;
                } catch {
                    return false;
                }
              })
              .sort(
                (a, b) =>
                  parseISO(a.date).getTime() - parseISO(b.date).getTime()
              )
              .slice(0, 5) // Show top 5
              .map(appt => (
                <li
                  key={appt.id}
                  className="p-3 border-l-4 border-primary bg-primary/10 rounded-r-md"
                >
                  <p className="font-semibold">
                    {appt.title} -{' '}
                    <span className="font-normal text-sm text-muted-foreground">
                      {format(parseISO(appt.date), 'MMM do')} at {appt.time}
                    </span>
                  </p>
                  {appt.description && (
                    <p className="text-xs text-muted-foreground">
                      {appt.description}
                    </p>
                  )}
                </li>
              ))}
            {allAppointments.filter(appt => {
              try {
                const apptDate = parseISO(appt.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sevenDaysFromNow = new Date();
                sevenDaysFromNow.setDate(today.getDate() + 7);
                return apptDate >= today && apptDate <= sevenDaysFromNow;
              } catch {
                  return false;
              }
            }).length === 0 && (
              <p className="text-muted-foreground">
                No upcoming appointments in the next 7 days.
              </p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
