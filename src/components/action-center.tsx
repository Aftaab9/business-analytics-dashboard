// src/components/action-center.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, Info, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActionItem = {
    id: string;
    type: string;
    title: string;
    description: string;
    status: 'Action Required' | 'Needs Attention' | 'Monitor' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
};

interface ActionCenterProps {
    title: string;
    description: string;
    items: ActionItem[];
    emptyStateMessage?: string;
}

const getPriorityStyles = (priority: ActionItem['priority']) => {
    switch (priority) {
        case 'High':
            return {
                icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
                borderColor: 'border-destructive'
            };
        case 'Medium':
            return {
                icon: <Bell className="h-5 w-5 text-yellow-500" />,
                borderColor: 'border-yellow-500'
            };
        case 'Low':
            return {
                icon: <Info className="h-5 w-5 text-blue-500" />,
                borderColor: 'border-blue-500'
            };
        default:
            return {
                icon: <Info className="h-5 w-5 text-muted-foreground" />,
                borderColor: 'border-muted'
            };
    }
};

export function ActionCenter({ title, description, items, emptyStateMessage = "No items requiring immediate action." }: ActionCenterProps) {
  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
            <div className="pr-4 space-y-4">
            {sortedItems.length > 0 ? (
                sortedItems.map(item => {
                    const { icon, borderColor } = getPriorityStyles(item.priority);
                    return (
                        <div key={item.id} className={`p-4 rounded-lg border-l-4 ${borderColor} bg-muted/50 hover:bg-muted transition-colors`}>
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{icon}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                                        <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>{item.priority} Priority</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    <p className="text-xs text-muted-foreground mt-2">Status: <span className="font-medium">{item.status}</span></p>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
                    <CheckCircle className="h-10 w-10 mb-2"/>
                    <p className="font-medium">{emptyStateMessage}</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
