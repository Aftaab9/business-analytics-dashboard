
'use client';

import { useRouter } from 'next/navigation';

import { SampleBarChart } from '../charts/sample-bar-chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  BarChartHorizontalBig,
  FileSpreadsheet,
  FileText,
  Settings,
  ShieldCheck,
  UploadCloud,
  Users,
} from 'lucide-react';

const mockUserActivity = [
  {
    id: '1',
    user: 'James Smith (CEO)',
    action: 'Viewed Financial Report',
    timestamp: '2024-07-15 10:05 AM',
    ip: '192.168.1.10',
  },
  {
    id: '2',
    user: 'Maria Garcia (CFO)',
    action: 'Generated Expense Forecast',
    timestamp: '2024-07-15 09:30 AM',
    ip: '192.168.1.12',
  },
  {
    id: '3',
    user: 'David Johnson (Inventory Head)',
    action: 'Updated Stock for INV003',
    timestamp: '2024-07-15 09:15 AM',
    ip: '192.168.1.15',
  },
  {
    id: '4',
    user: 'Emily Brown (Sales Manager)',
    action: 'Reviewed team performance',
    timestamp: '2024-07-15 08:45 AM',
    ip: '192.168.1.18',
  },
  {
    id: '5',
    user: 'Michael Chen (Admin)',
    action: 'Logged In',
    timestamp: '2024-07-14 03:20 PM',
    ip: '192.168.1.1',
  },
];

const securityMetricsData = [
  {name: 'Firewall', score: 100, fill: 'var(--chart-1)'},
  {name: 'Access Control', score: 90, fill: 'var(--chart-2)'},
  {name: 'Patching', score: 95, fill: 'var(--chart-3)'},
  {name: 'Logging', score: 85, fill: 'var(--chart-4)'},
  {name: 'Endpoint Security', score: 92, fill: 'var(--chart-5)'},
];

export function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-semibold text-foreground">
        Administrator Dashboard
      </h2>
      <p className="text-muted-foreground">
        Manage users, system settings, and monitor activity.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5 since last week
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">All systems normal</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <BarChartHorizontalBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">User registrations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Recent User Activity
          </CardTitle>
          <CardDescription>
            Overview of recent actions performed by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUserActivity.slice(0, 5).map(activity => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{activity.ip}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <Button variant="link">View All Activity</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            System Management
          </CardTitle>
          <CardDescription>
            Quick access to common administrative tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Manage Users
          </Button>
          <Button variant="outline">
            <ShieldCheck className="mr-2 h-4 w-4" /> Roles & Permissions
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> System Configuration
          </Button>
          <Button variant="outline">Audit Logs</Button>
          <Button variant="outline">Backup & Restore</Button>
          <Button variant="destructive">System Maintenance Mode</Button>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/consolidated-report')}>
            <FileText className="mr-2 h-4 w-4" /> Generate Business Analysis
            Report
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <UploadCloud className="mr-2 h-5 w-5 text-primary" />
            InsightFlow Data Connector (Beta)
          </CardTitle>
          <CardDescription>
            Upload your business data to power the analytics dashboards. All
            processing happens securely in your environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">
              Click to upload or drag and drop your dataset
            </p>
            <p className="text-sm text-muted-foreground">
              CSV, XLSX, or JSON format supported
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                Required Data Schema
              </h4>
              <p className="text-sm text-muted-foreground">
                For optimal results, your dataset should contain the following
                columns:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-muted-foreground bg-muted/50 p-4 rounded-md">
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    InvoiceNo
                  </code>
                  : Unique ID for each transaction.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    StockCode
                  </code>
                  : Unique ID for each product.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    Description
                  </code>
                  : Name of the product.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    Quantity
                  </code>
                  : Number of items sold.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    InvoiceDate
                  </code>
                  : Date of the transaction (ISO format recommended).
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    UnitPrice
                  </code>
                  : Price of a single item.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    CustomerID
                  </code>
                  : Unique ID for each customer.
                </li>
                <li>
                  <code className="font-mono bg-background p-1 rounded">
                    Country
                  </code>
                  : Customer's country.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Data Recommendations
              </h4>
              <ul className="mt-2 list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>
                  Minimum of **10,000 transaction rows** for robust pattern
                  detection.
                </li>
                <li>
                  Data should span at least **12 consecutive months** for
                  accurate trend and seasonality analysis.
                </li>
              </ul>
            </div>
          </div>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Beta Testing Note</AlertTitle>
            <AlertDescription>
              This data connector is currently in beta. All visualizations in
              this demo are powered by a sample dataset based on the "Online
              Retail II" collection to showcase InsightFlow's capabilities.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button disabled>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload & Process Data
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            Security Overview
          </CardTitle>
          <CardDescription>
            Live overview of key security metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 items-center gap-4">
          <SampleBarChart
            data={securityMetricsData}
            dataKeys={[{key: 'score', color: '1', name: 'Score'}]}
            xAxisKey="name"
            title="Security Component Scores"
            description="Scores out of 100 for each system component."
            colorEachBar={true}
          />
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Overall Security Score:{' '}
              <span className="text-green-600">92/100</span>
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                Firewall Status:{' '}
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Active
                </Badge>
              </li>
              <li>
                Failed Login Attempts (24h):{' '}
                <span className="text-yellow-600">5</span>
              </li>
              <li>
                System Patches: <span className="text-green-600">Up-to-date</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground italic">
              Scores are updated in real-time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
