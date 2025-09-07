// src/components/role-dashboards/general-user-dashboard.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { CalendarDays, CheckCircle, Bell, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

// Mock data for a general user
const mockUserTasks = [
  { id: 1, title: "Complete Q2 Sales Report", dueDate: "2024-07-20", status: "Pending" },
  { id: 2, title: "Follow up with Client Y", dueDate: "2024-07-18", status: "In Progress" },
  { id: 3, title: "Submit Expense Claims", dueDate: "2024-07-25", status: "Pending" },
  { id: 4, title: "Team Meeting Preparation", dueDate: "2024-07-17", status: "Completed" },
];

const upcomingAppointments = [
    { id: 1, title: "Project Alpha Sync", time: "Tomorrow, 10:00 AM"},
    { id: 2, title: "Client Demo - Beta Corp", time: "July 25th, 02:00 PM"},
]

export function GeneralUserDashboard() {
  const pendingTasks = mockUserTasks.filter(task => task.status === "Pending").length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-semibold text-foreground">Welcome, User!</h2>
      <p className="text-muted-foreground">Here's a quick overview of your workspace and tasks.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Pending Tasks" value={pendingTasks.toString()} icon={Briefcase} description="Require your attention" />
        <KpiCard title="Upcoming Appointments" value={upcomingAppointments.length.toString()} icon={CalendarDays} description="In the next 7 days" />
        <KpiCard title="Completed Tasks (Month)" value="12" icon={CheckCircle} description="Well done!" />
        <KpiCard title="Notifications" value="3" icon={Bell} description="Unread messages" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your Tasks</CardTitle>
            <CardDescription>Tasks assigned to you. Click to manage.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockUserTasks.slice(0,3).map(task => (
                <li key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === "Completed" ? "bg-green-200 text-green-800" :
                    task.status === "In Progress" ? "bg-blue-200 text-blue-800" :
                    "bg-yellow-200 text-yellow-800"
                  }`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4">View All Tasks</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled meetings and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
                {upcomingAppointments.map(appt => (
                     <li key={appt.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <CalendarDays className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
                        <div>
                            <p className="font-medium">{appt.title}</p>
                            <p className="text-sm text-muted-foreground">{appt.time}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <Link href="/calendar">
              <Button variant="link" className="mt-4">Go to Calendar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
            <CardDescription>Access frequently used features.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" asChild><Link href="/reports">My Reports</Link></Button>
            <Button variant="outline" asChild><Link href="/forecasting">Create Forecast</Link></Button>
            <Button variant="outline">Submit Timesheet</Button>
            <Button variant="outline">Request Leave</Button>
            <Button variant="outline">Company Directory</Button>
            <Button variant="outline">Help & Support</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-700">
            <h4 className="font-semibold">New Training Module Available!</h4>
            <p className="text-sm">Check out the new "Advanced Data Analysis" training in the learning portal. Mandatory for all analysts by July 30th.</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
