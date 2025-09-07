// src/lib/placeholder-data.ts
import type {
  FinancialRecord,
  Appointment,
  InventoryItem,
  Product,
  Customer,
  SalesTransaction,
  ClassificationInsight,
  CustomerCluster,
  ForecastDataPoint,
  UserSpecificRole,
  ExpenseTransaction,
  PhillipsCurveDataPoint,
  MonopolyDataPoint,
  ForecastingMethodsDataPoint,
  AssociationRule,
  DuopolyDataPoint,
  MarketScenario,
} from '@/types';

// Data scaled up to be in the millions for more realistic representation
export const mockFinancialData: FinancialRecord[] = [
  { month: 'Jan', revenue: 1500000, expenses: 800000, profit: 700000 },
  { month: 'Feb', revenue: 1700000, expenses: 850000, profit: 850000 },
  { month: 'Mar', revenue: 1600000, expenses: 820000, profit: 780000 },
  { month: 'Apr', revenue: 1800000, expenses: 900000, profit: 900000 },
  { month: 'May', revenue: 2000000, expenses: 950000, profit: 1050000 },
  { month: 'Jun', revenue: 1900000, expenses: 920000, profit: 980000 },
  { month: 'Jul', revenue: 2100000, expenses: 1000000, profit: 1100000 },
  { month: 'Aug', revenue: 2200000, expenses: 1050000, profit: 1150000 },
  { month: 'Sep', revenue: 2000000, expenses: 980000, profit: 1020000 },
  { month: 'Oct', revenue: 2300000, expenses: 1100000, profit: 1200000 },
  { month: 'Nov', revenue: 2500000, expenses: 1150000, profit: 1350000 },
  { month: 'Dec', revenue: 2800000, expenses: 1200000, profit: 1600000 },
];

export const mockStrategicInitiativesData = mockFinancialData.map((item, index) => ({
    month: item.month,
    initiativeA: item.revenue * 0.15 + (index * 5000) + 15000,
    initiativeB: item.profit * 0.25 + (index * 3000) + 12000,
}));

// Helper function to generate date strings relative to today
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};

const ceoAppointments: Appointment[] = [
    { id: 'ceo1', date: getDateString(-7), title: 'Board Meeting Prep', time: '10:00', description: 'Finalize presentation for Q3 review.' },
    { id: 'ceo2', date: getDateString(-2), title: 'Leadership Council', time: '14:00', description: 'Weekly sync with department heads.' },
    { id: 'ceo4', date: getDateString(0), title: '1-on-1 with CFO', time: '11:00', description: 'Sync on financial outlook.' },
    { id: 'ceo3', date: getDateString(3), title: 'Investor Relations Call', time: '14:00', description: 'Discuss quarterly performance.' },
    { id: 'ceo5', date: getDateString(7), title: 'Strategic Planning Offsite', time: '09:00', description: 'Full-day session with leadership team.' },
];

const cfoAppointments: Appointment[] = [
    { id: 'cfo1', date: getDateString(-5), title: 'Budget Review: Marketing', time: '13:00', description: 'Finalize H2 budget for marketing.' },
    { id: 'cfo4', date: getDateString(0), title: '1-on-1 with CEO', time: '11:00', description: 'Sync on financial outlook.' },
    { id: 'cfo2', date: getDateString(2), title: 'Audit Committee Meeting', time: '10:00', description: 'Review internal controls.' },
    { id: 'cfo3', date: getDateString(6), title: 'Quarterly Earnings Call Prep', time: '09:30', description: 'Session with the full finance team.' },
];

const inventoryHeadAppointments: Appointment[] = [
    { id: 'inv1', date: getDateString(-6), title: 'Supplier Review - TechSupply Co.', time: '11:00', description: 'Quarterly business review.' },
    { id: 'inv4', date: getDateString(0), title: 'Stock Reconciliation Check', time: '09:00', description: 'Cycle count verification.' },
    { id: 'inv2', date: getDateString(4), title: 'Warehouse Operations Review', time: '14:00', description: 'Monthly efficiency check.' },
    { id: 'inv3', date: getDateString(8), title: 'Demand Forecast Meeting', time: '10:00', description: 'Collaborate with Sales & Marketing.' },
];

const salesManagerAppointments: Appointment[] = [
    { id: 'sales1', date: getDateString(-4), title: 'Team Training: New CRM Features', time: '09:00', description: 'Training session on advanced features.' },
    { id: 'sales4', date: getDateString(0), title: 'Lead Qualification Session', time: '15:00', description: 'Review new inbound leads.' },
    { id: 'sales2', date: getDateString(1), title: 'Sales Team Weekly Sync', time: '13:00', description: 'Review previous week and plan for the next.' },
    { id: 'sales3', date: getDateString(5), title: 'Pipeline Review - Q3', time: '11:00', description: 'Deep dive into current sales pipeline.' },
];

const cmoAppointments: Appointment[] = [
    { id: 'cmo1', date: getDateString(-3), title: 'Q4 Campaign Kick-off', time: '10:00', description: 'Finalize strategy and budget for the holiday campaign.' },
    { id: 'cmo2', date: getDateString(0), title: 'Brand Sentiment Review', time: '14:00', description: 'Analyze social media trends and customer feedback.' },
    { id: 'cmo3', date: getDateString(2), title: 'Agency Sync - Creative Concepts', time: '11:00', description: 'Review new ad creatives with external agency.' },
    { id: 'cmo4', date: getDateString(9), title: 'Marketing Analytics Deep Dive', time: '15:00', description: 'Monthly review of all campaign performance metrics.' },
];


export const mockQuarterlySalesData = [
  { quarter: 'Q1', sales: 450000, target: 400000 },
  { quarter: 'Q2', sales: 520000, target: 500000 },
  { quarter: 'Q3', sales: 480000, target: 550000 },
  { quarter: 'Q4', sales: 600000, target: 600000 },
];

export const mockTeamPerformance = [
  { name: 'Liam Miller', sales: 55000, quota: 50000, deals: 12 },
  { name: 'Olivia Davis', sales: 48000, quota: 50000, deals: 10 },
  { name: 'Noah Wilson', sales: 62000, quota: 50000, deals: 15 },
  { name: 'Emma Moore', sales: 45000, quota: 50000, deals: 9 },
  { name: 'Sophia Taylor', sales: 51000, quota: 50000, deals: 11 },
];

// This function returns appointments based on the user's role.
export function getAppointmentsForRole(role: UserSpecificRole | null): Appointment[] {
  switch (role) {
    case 'CEO':
      return ceoAppointments;
    case 'CFO':
      return cfoAppointments;
    case 'Inventory Head':
      return inventoryHeadAppointments;
    case 'Sales Manager':
      return salesManagerAppointments;
    case 'CMO':
      return cmoAppointments;
    default:
      // For Admins or general users without a specific role
      return [
        { id: 'gen1', date: getDateString(1), title: 'Company All-Hands Meeting', time: '16:00', description: 'Monthly company update.' },
        { id: 'gen2', date: getDateString(10), title: 'IT System Maintenance Window', time: '18:00', description: 'Scheduled downtime for updates.' },
        { id: 'gen3', date: getDateString(0), title: 'Office Fire Drill', time: '10:30', description: 'Annual safety drill.' },
      ];
  }
}


export const mockInventory: InventoryItem[] = [
  // Electronics
  { id: '22720', name: 'Wireless Mouse', category: 'Electronics', stock: 150, price: 25.99, supplier: 'TechSupply Co.' },
  { id: '22727', name: 'Mechanical Keyboard', category: 'Electronics', stock: 80, price: 79.99, supplier: 'Gadget Universe' },
  { id: '22728', name: '27-inch Monitor', category: 'Electronics', stock: 60, price: 299.00, supplier: 'VisionMax Displays' },
  { id: '21730', name: 'USB-C Hub', category: 'Electronics', stock: 120, price: 45.50, supplier: 'ConnectAll' },
  { id: '84879', name: 'Portable SSD 1TB', category: 'Electronics', stock: 40, price: 89.99, supplier: 'DataStore' },

  // Furniture
  { id: '23203', name: 'Ergonomic Office Chair', category: 'Furniture', stock: 45, price: 129.50, supplier: 'ComfortZone Inc.' },
  { id: '23204', name: 'Standing Desk', category: 'Furniture', stock: 30, price: 399.00, supplier: 'UpLift Desks' },
  { id: '23205', name: 'Bookshelf, 5-tier', category: 'Furniture', stock: 55, price: 89.99, supplier: 'HomeGoods' },
  
  // Stationery
  { id: '22633', name: 'Notebook A5 (Pack of 3)', category: 'Stationery', stock: 300, price: 12.00, supplier: 'PaperWorld' },
  { id: '22634', name: 'Gel Pens (12-pack)', category: 'Stationery', stock: 450, price: 9.50, supplier: 'PaperWorld' },

  // Homeware
  { id: '85123A', name: 'Alarm Clock Bakelike Red', category: 'Homeware', stock: 75, price: 3.75, supplier: 'Home Time' },
  { id: '71053', name: 'White Metal Lantern', category: 'Homeware', stock: 110, price: 3.39, supplier: 'LightUp' },
  { id: '84997D', name: 'Set of 6 Spice Jars', category: 'Homeware', stock: 88, price: 7.95, supplier: 'KitchenPlus' },
  
  // Kitchenware
  { id: '21212', name: 'Set of 3 Cake Tins Pantry Design', category: 'Kitchenware', stock: 95, price: 4.95, supplier: 'BakeWell' },
  { id: '22423', name: 'French Press Coffee Maker', category: 'Kitchenware', stock: 65, price: 22.50, supplier: 'Brewtiful' },
  { id: '20725', name: 'Bamboo Chopping Board', category: 'Kitchenware', stock: 180, price: 15.00, supplier: 'EcoKitchen' },
  
  // Decorations
  { id: '22178', name: 'Assorted Colour Bird Ornament', category: 'Decorations', stock: 250, price: 1.69, supplier: 'DecorateMe' },
  { id: '21754', name: 'Glass Star Frosted T-Light Holder', category: 'Decorations', stock: 130, price: 4.25, supplier: 'Glow Decor' },
  { id: '47566B', name: 'Felt Heart Wall Hanging', category: 'Decorations', stock: 48, price: 2.55, supplier: 'Crafty Creations' },
  { id: '22554', name: 'Photo Frame, Antique Style', category: 'Decorations', stock: 90, price: 12.95, supplier: 'Vintage Finds' },
];

export const historicalDataCSVExample = `Date,Revenue,Expenses
2023-01-01,10000,6000
2023-02-01,11000,6500
2023-03-01,10500,6200
2023-04-01,12000,7000
2023-05-01,13000,7500
2023-06-01,12500,7200`;

export const marketTrendsExample = `The market is experiencing steady growth in Q1 and Q2. Consumer spending is up by 5% year-over-year. New competitor AlphaCorp entered the market in Q2, potentially impacting sales. Raw material costs are expected to increase by 3% in the next quarter.`;

export const inventoryMarketTrendsExample = `Consumer interest in 'work from home' electronics remains strong. There is a seasonal uptick in 'Decorations' expected in Q4. A new competitor has launched a similar line of 'Kitchenware', potentially increasing price pressure.`;

export const sampleReportText = `
Quarterly Performance Review - Q2 2024

Key Highlights:
- Total Revenue: $57,000 (achieved by summing Feb, Mar, Apr revenues from mockFinancialData as an example)
- Total Expenses: $26,700 (similarly summed)
- Net Profit: $30,300
- Profit Margin: 53.16%

Significant Achievements:
- Successfully launched new product line "EcoEssentials", contributing 15% to total revenue.
- Expanded customer base by 12% through targeted marketing campaigns.
- Streamlined operational costs, resulting in a 5% reduction in overheads compared to Q1.

Challenges:
- Increased competition in the "Gadget Universe" sector.
- Supply chain disruptions for "Component Z" affected production for 2 weeks.

Future Outlook:
- Projecting a 10% revenue growth for Q3.
- Focus on mitigating supply chain risks by diversifying suppliers.
- Investment in R&D for next-generation product enhancements.
`;

// Mock data for Online Retail II dataset types
export const mockProducts: Product[] = [
  { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', unitPrice: 4.95, category: 'Kitchenware' },
  { stockCode: '22727', description: 'ALARM CLOCK BAKELIKE RED', unitPrice: 3.75, category: 'Homeware' },
  { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', unitPrice: 1.69, category: 'Decorations' },
  { stockCode: '21730', description: 'GLASS STAR FROSTED T-LIGHT HOLDER', unitPrice: 4.25, category: 'Decorations' },
];

export const mockCustomers: Customer[] = [
  { customerID: '17850', country: 'United Kingdom' },
  { customerID: '13047', country: 'United Kingdom' },
  { customerID: '12583', country: 'France' },
  { customerID: '14606', country: 'United Kingdom' },
];

export const mockSalesTransactions: SalesTransaction[] = [
  // Existing data
  { invoiceNo: '536365', stockCode: '85123A', description: 'ALARM CLOCK BAKELIKE RED', quantity: 6, invoiceDate: '2010-12-01T08:26:00Z', unitPrice: 3.75, customerID: '17850', country: 'United Kingdom', totalPrice: 22.5 },
  { invoiceNo: '536365', stockCode: '71053', description: 'WHITE METAL LANTERN', quantity: 6, invoiceDate: '2010-12-01T08:26:00Z', unitPrice: 3.39, customerID: '17850', country: 'United Kingdom', totalPrice: 20.34 },
  { invoiceNo: 'C536379', stockCode: 'D', description: 'Discount', quantity: -1, invoiceDate: '2010-12-01T09:41:00Z', unitPrice: 27.50, customerID: '14527', country: 'United Kingdom', isCancellation: true, totalPrice: -27.50 },
  
  // Sales for new inventory items across different months to build history
  // Month 1
  { invoiceNo: '536381', stockCode: '22720', description: 'Wireless Mouse', quantity: 10, invoiceDate: '2011-08-01T09:41:00Z', unitPrice: 25.99, customerID: '15311', country: 'United Kingdom', totalPrice: 259.90 },
  { invoiceNo: '536382', stockCode: '22727', description: 'Mechanical Keyboard', quantity: 5, invoiceDate: '2011-08-05T10:11:00Z', unitPrice: 79.99, customerID: '15312', country: 'France', totalPrice: 399.95 },
  { invoiceNo: '536383', stockCode: '23203', description: 'Ergonomic Office Chair', quantity: 2, invoiceDate: '2011-08-10T11:21:00Z', unitPrice: 129.50, customerID: '15313', country: 'Germany', totalPrice: 259.00 },
  { invoiceNo: '536384', stockCode: '22423', description: 'French Press Coffee Maker', quantity: 8, invoiceDate: '2011-08-15T12:51:00Z', unitPrice: 22.50, customerID: '15314', country: 'United Kingdom', totalPrice: 180.00 },
  
  // Month 2
  { invoiceNo: '537001', stockCode: '22720', description: 'Wireless Mouse', quantity: 12, invoiceDate: '2011-09-02T09:00:00Z', unitPrice: 25.99, customerID: '16001', country: 'United Kingdom', totalPrice: 311.88 },
  { invoiceNo: '537002', stockCode: '22727', description: 'Mechanical Keyboard', quantity: 8, invoiceDate: '2011-09-06T10:30:00Z', unitPrice: 79.99, customerID: '16002', country: 'France', totalPrice: 639.92 },
  { invoiceNo: '537003', stockCode: '84879', description: 'Portable SSD 1TB', quantity: 4, invoiceDate: '2011-09-11T11:45:00Z', unitPrice: 89.99, customerID: '16003', country: 'Germany', totalPrice: 359.96 },
  { invoiceNo: '537004', stockCode: '22423', description: 'French Press Coffee Maker', quantity: 10, invoiceDate: '2011-09-16T13:00:00Z', unitPrice: 22.50, customerID: '16004', country: 'United Kingdom', totalPrice: 225.00 },
  
  // Month 3
  { invoiceNo: '538001', stockCode: '22720', description: 'Wireless Mouse', quantity: 15, invoiceDate: '2011-10-03T09:15:00Z', unitPrice: 25.99, customerID: '17001', country: 'United Kingdom', totalPrice: 389.85 },
  { invoiceNo: '538002', stockCode: '22727', description: 'Mechanical Keyboard', quantity: 6, invoiceDate: '2011-10-07T10:45:00Z', unitPrice: 79.99, customerID: '17002', country: 'France', totalPrice: 479.94 },
  { invoiceNo: '538003', stockCode: '22728', description: '27-inch Monitor', quantity: 3, invoiceDate: '2011-10-12T12:00:00Z', unitPrice: 299.00, customerID: '17003', country: 'Germany', totalPrice: 897.00 },
  { invoiceNo: '538004', stockCode: '84879', description: 'Portable SSD 1TB', quantity: 5, invoiceDate: '2011-10-17T13:15:00Z', unitPrice: 89.99, customerID: '17004', country: 'United Kingdom', totalPrice: 449.95 },
  { invoiceNo: '538005', stockCode: '21212', description: 'Set of 3 Cake Tins Pantry Design', quantity: 20, invoiceDate: '2011-10-18T14:00:00Z', unitPrice: 4.95, customerID: '17005', country: 'United Kingdom', totalPrice: 99.00 },
  { invoiceNo: '538006', stockCode: '21754', description: 'Glass Star Frosted T-Light Holder', quantity: 30, invoiceDate: '2011-10-19T15:00:00Z', unitPrice: 4.25, customerID: '17006', country: 'USA', totalPrice: 127.5 },
  
  // Added data for Netherlands and EIRE
  { invoiceNo: '539001', stockCode: '22720', description: 'Wireless Mouse', quantity: 5, invoiceDate: '2011-11-01T10:00:00Z', unitPrice: 25.99, customerID: '18001', country: 'Netherlands', totalPrice: 129.95 },
  { invoiceNo: '539001', stockCode: '22727', description: 'Mechanical Keyboard', quantity: 2, invoiceDate: '2011-11-01T10:00:00Z', unitPrice: 79.99, customerID: '18001', country: 'Netherlands', totalPrice: 159.98 },
  { invoiceNo: '539002', stockCode: '23203', description: 'Ergonomic Office Chair', quantity: 3, invoiceDate: '2011-11-02T11:00:00Z', unitPrice: 129.50, customerID: '18002', country: 'EIRE', totalPrice: 388.50 },
  { invoiceNo: '539003', stockCode: '22423', description: 'French Press Coffee Maker', quantity: 4, invoiceDate: '2011-11-03T12:00:00Z', unitPrice: 22.50, customerID: '18003', country: 'EIRE', totalPrice: 90.00 },
];


export const mockExpenseTransactions: ExpenseTransaction[] = [
  { id: 'exp001', date: '2024-07-01', amount: 150.75, category: 'Office Supplies', description: 'Bulk order of printer paper and toner', vendor: 'OfficeMax' },
  { id: 'exp002', date: '2024-07-02', amount: 85.00, category: 'Software', description: 'Monthly subscription for CRM tool', vendor: 'SaaSy Inc.' },
  { id: 'exp003', date: '2024-07-03', amount: 1250.00, category: 'Travel', description: 'Flight to NYC for client meeting', vendor: 'United Airlines' },
  { id: 'exp004', date: '2024-07-05', amount: 75.50, category: 'Meals', description: 'Team lunch', vendor: 'The Corner Cafe' },
  // Potential Anomaly 1: Unusually high amount for "Meals"
  { id: 'exp005', date: '2024-07-08', amount: 950.00, category: 'Meals', description: 'Client dinner', vendor: 'The Steakhouse' },
  { id: 'exp006', date: '2024-07-10', amount: 25.00, category: 'Office Supplies', description: 'Pens and notepads', vendor: 'Staples' },
  // Potential Anomaly 2: Vague description and unusual vendor for "Software"
  { id: 'exp007', date: '2024-07-12', amount: 300.00, category: 'Software', description: 'Tool purchase', vendor: 'Random Software LLC' },
  { id: 'exp008', date: '2024-07-15', amount: 5000.00, category: 'Marketing', description: 'Q3 Social Media Campaign Boost', vendor: 'Meta Platforms' },
  // Potential Anomaly 3: Expense on a weekend
  { id: 'exp009', date: '2024-07-20', amount: 250.00, category: 'Travel', description: 'Taxi services for weekend travel', vendor: 'Yellow Cab' },
];


// Mock data for ML Model Outputs
export const mockClassificationInsights: ClassificationInsight[] = [
  { itemId: '17850', customerName: 'Sean', type: 'customerSegmentation', predictedClass: 'High-Value', probability: 0.85, featureContributions: [{feature: 'total_spent', contribution: 0.6}, {feature: 'frequency', contribution: 0.25}, {feature: 'recency', contribution: 0.15}] },
  { itemId: '13047', customerName: 'Heena', type: 'customerSegmentation', predictedClass: 'Occasional Buyer', probability: 0.60, featureContributions: [{feature: 'total_spent', contribution: 0.4}, {feature: 'frequency', contribution: -0.1}, {feature: 'recency', contribution: 0.5}] },
  { itemId: '12583', customerName: 'David Johnson', type: 'purchaseLikelihood', predictedClass: 'Likely to Buy', productName: 'Standing Desk', probability: 0.82, featureContributions: [{feature: 'Viewed Furniture', contribution: 0.5}, {feature: 'Is High-Value', contribution: 0.22}, {feature: 'Returning Visitor', contribution: 0.28}] },
  { itemId: '15311', customerName: 'Michael Chen', type: 'purchaseLikelihood', predictedClass: 'Likely to Buy', productName: '27-inch Monitor', probability: 0.75, featureContributions: [{feature: 'Viewed Electronics', contribution: 0.6}, {feature: 'Abandoned Cart', contribution: -0.1}, {feature: 'Returning Visitor', contribution: 0.3}] },
  { itemId: 'lead-001', customerName: 'New Lead Inc.', type: 'leadConversion', predictedClass: 'High-Value Lead', probability: 0.88, featureContributions: [{feature: 'Industry Match', contribution: 0.4}, {feature: 'Web Engagement', contribution: 0.3}, {feature: 'Company Size', contribution: 0.18}] },
  { itemId: 'lead-002', customerName: 'Prospect Co.', type: 'leadConversion', predictedClass: 'Low-Value Lead', probability: 0.35, featureContributions: [{feature: 'Industry Match', contribution: 0.1}, {feature: 'Web Engagement', contribution: -0.2}, {feature: 'Company Size', contribution: 0.05}] },
];

export const mockCustomerClusters: CustomerCluster[] = [
  { customerID: "17850", clusterId: "Cluster A", clusterLabel: "Loyal Champions", x: 0.88, y: 0.5, personaDescription: "High frequency, high value customers who purchase across multiple categories." },
  { customerID: "13047", clusterId: "Cluster B", clusterLabel: "Budget Shoppers", x: -0.77, y: -0.61, personaDescription: "Price-sensitive customers, primarily buying discounted items or during sales." },
  { customerID: "12583", clusterId: "Cluster A", clusterLabel: "Loyal Champions", x: 0.6, y: 0.7, personaDescription: "High frequency, high value customers who purchase across multiple categories." },
  { customerID: "14606", clusterId: "Cluster C", clusterLabel: "Newcomers", x: 0.1, y: -0.8, personaDescription: "New customers with few purchases, potential for growth." },
  { customerID: "15311", clusterId: "Cluster B", clusterLabel: "Budget Shoppers", x: -0.3, y: -0.4, personaDescription: "Price-sensitive customers, primarily buying discounted items or during sales." },
  { customerID: '15312', clusterId: 'Cluster A', clusterLabel: 'Loyal Champions', x: 0.68, y: 0.71, personaDescription: 'High frequency, high value customers who purchase across multiple categories.' },
  { customerID: '15313', clusterId: 'Cluster C', clusterLabel: 'Newcomers', x: 0.12, y: -0.75, personaDescription: 'New customers with few purchases, potential for growth.' },
  { customerID: '16001', clusterId: 'Cluster B', clusterLabel: 'Budget Shoppers', x: -0.5, y: -0.55, personaDescription: 'Price-sensitive customers, primarily buying discounted items or during sales.' },
  { customerID: '16002', clusterId: 'Cluster A', clusterLabel: 'Loyal Champions', x: 0.75, y: 0.65, personaDescription: 'High frequency, high value customers who purchase across multiple categories.' },
  { customerID: '17001', clusterId: 'Cluster C', clusterLabel: 'Newcomers', x: 0.05, y: -0.85, personaDescription: 'New customers with few purchases, potential for growth.' },
  { customerID: '17002', clusterId: 'Cluster B', clusterLabel: 'Budget Shoppers', x: -0.4, y: -0.3, personaDescription: 'Price-sensitive customers, primarily buying discounted items or during sales.' },
];

export const mockForecastDataPoints: ForecastDataPoint[] = [
  { date: '2024-08-01', itemName: 'total_revenue', predictedValue: 23000, confidenceIntervalLower: 21000, confidenceIntervalUpper: 25000, actualValue: 22500 },
  { date: '2024-09-01', itemName: 'total_revenue', predictedValue: 24000, confidenceIntervalLower: 22000, confidenceIntervalUpper: 26000 },
  { date: '2024-08-01', itemName: '22720_demand', predictedValue: 50, confidenceIntervalLower: 40, confidenceIntervalUpper: 60 },
];

export const mockAssociationRules: AssociationRule[] = [
  { antecedents: ['Ergonomic Office Chair'], consequents: ['Standing Desk'], confidence: 0.78, lift: 2.3, support: 0.25 },
  { antecedents: ['Mechanical Keyboard'], consequents: ['Wireless Mouse'], confidence: 0.85, lift: 2.1, support: 0.30 },
  { antecedents: ['Notebook A5 (Pack of 3)'], consequents: ['Gel Pens (12-pack)'], confidence: 0.65, lift: 2.8, support: 0.45 },
  { antecedents: ['27-inch Monitor'], consequents: ['USB-C Hub'], confidence: 0.72, lift: 1.8, support: 0.28 },
  { antecedents: ['French Press Coffee Maker'], consequents: ['Bamboo Chopping Board'], confidence: 0.60, lift: 1.9, support: 0.22 },
];


export const mockPhillipsCurveData: PhillipsCurveDataPoint[] = [
  { unemployment: 3.0, inflation: 5.5 }, { unemployment: 3.1, inflation: 4.8 },
  { unemployment: 3.4, inflation: 5.2 }, { unemployment: 3.8, inflation: 4.9 },
  { unemployment: 4.0, inflation: 4.5 }, { unemployment: 4.1, inflation: 5.1 },
  { unemployment: 4.4, inflation: 4.2 }, { unemployment: 4.5, inflation: 4.4 },
  { unemployment: 5.0, inflation: 3.9 }, { unemployment: 5.2, inflation: 3.5 },
  { unemployment: 5.8, inflation: 3.1 }, { unemployment: 6.2, inflation: 2.8 },
  { unemployment: 6.8, inflation: 2.5 }, { unemployment: 7.5, inflation: 2.2 },
  { unemployment: 7.8, inflation: 2.9 }, { unemployment: 7.9, inflation: 2.0 },
  { unemployment: 8.1, inflation: 1.8 }, { unemployment: 8.2, inflation: 2.1 },
  { unemployment: 8.5, inflation: 1.5 }, { unemployment: 8.8, inflation: 1.4 },
  { unemployment: 9.2, inflation: 1.1 }, { unemployment: 9.6, inflation: 0.8 },
  { unemployment: 9.8, inflation: 0.2 },
];

export const mockMonopolyData: MonopolyDataPoint[] = (() => {
  const data: MonopolyDataPoint[] = [];
  // Generate data points for the curves
  for (let q = 0; q <= 1000; q += 50) {
    data.push({
      quantity: q,
      demand: 200 - 0.2 * q,
      mr: 200 - 0.4 * q,
      mc: 10 + 0.1 * q,
    });
  }

  // Define key points
  const decisionQuantity = 380;
  const decisionValue = 48; // This is where MR = MC (200 - 0.4*380 = 48; 10 + 0.1*380 = 48)
  const monopolyPrice = 124; // This is the price on the demand curve (200 - 0.2*380 = 124)

  // Add a specific point FOR the decision point (MR=MC)
  data.push({
      quantity: decisionQuantity,
      demand: null,
      mr: decisionValue,
      mc: decisionValue, 
      decisionPoint: decisionValue,
  });
  
  // Add a specific point FOR the monopoly price on the demand curve
  data.push({
      quantity: decisionQuantity,
      demand: monopolyPrice,
      mr: null,
      mc: null,
      monopolyPrice: monopolyPrice
  });

  // Sort data by quantity to ensure lines are drawn correctly
  return data.sort((a, b) => a.quantity - b.quantity);
})();

export const mockForecastingData: ForecastingMethodsDataPoint[] = (() => {
  const actuals = [
    850000, 700000, 550000, 700000, 650000, 750000, 700000, 650000, 800000,
    1000000, 1200000, 1450000,
  ];
  const months = [
    'Jan 2010', 'Feb 2010', 'Mar 2010', 'Apr 2010', 'May 2010', 'Jun 2010',
    'Jul 2010', 'Aug 2010', 'Sep 2010', 'Oct 2010', 'Nov 2010', 'Dec 2010',
  ];
  const forecastMonths = ['Jan 2011', 'Feb 2011', 'Mar 2011'];

  const data: ForecastingMethodsDataPoint[] = [];

  // Calculate MA
  const movingAverage = (data: number[], size: number) => {
    const result: (number | null)[] = Array(data.length).fill(null);
    for (let i = size - 1; i < data.length; i++) {
      const sum = data.slice(i - size + 1, i + 1).reduce((a, b) => a + b, 0);
      result[i] = sum / size;
    }
    return result;
  };
  const ma3 = movingAverage(actuals, 3);

  // Calculate EWMA
  const exponentialMovingAverage = (data: number[], alpha: number) => {
    const result: (number | null)[] = [];
    if (data.length > 0) {
      result[0] = data[0]; // Seed with the first value
      for (let i = 1; i < data.length; i++) {
        result[i] = alpha * data[i] + (1 - alpha) * result[i - 1]!;
      }
    }
    return result;
  };
  const ewma03 = exponentialMovingAverage(actuals, 0.3);

  // Calculate Regression
  const calculateLinearRegression = (data: number[]) => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += data[i];
        sumXY += i * data[i];
        sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };
  const { slope, intercept } = calculateLinearRegression(actuals);
  const regressionValues = actuals.map((_, i) => slope * i + intercept);

  // Combine historical data
  for (let i = 0; i < actuals.length; i++) {
    data.push({
      month: months[i],
      actual: actuals[i],
      ma: ma3[i],
      ewma: ewma03[i],
      regression: regressionValues[i],
    });
  }

  // Add forecast data
  for (let i = 0; i < forecastMonths.length; i++) {
    const forecastIndex = actuals.length + i;
    const forecastValue = slope * forecastIndex + intercept;
    data.push({
      month: forecastMonths[i],
      actual: null,
      ma: null,
      ewma: null,
      regression: forecastValue,
      forecastPoint: forecastValue,
    });
  }
  return data;
})();

export const getCountryMetricsData = (barChartFormat = false): { data: any[], countries?: any[] } => {
  const targetCountries = ['United Kingdom', 'Germany', 'France', 'Netherlands', 'EIRE'];
  const salesByCountry: { [key: string]: SalesTransaction[] } = {};

  // Group transactions by country
  mockSalesTransactions.forEach(tx => {
    if (tx.country && targetCountries.includes(tx.country) && !tx.isCancellation && tx.totalPrice) {
      if (!salesByCountry[tx.country]) {
        salesByCountry[tx.country] = [];
      }
      salesByCountry[tx.country].push(tx);
    }
  });

  // Calculate raw metrics
  const rawMetrics = targetCountries.map(country => {
    const transactions = salesByCountry[country] || [];
    const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.totalPrice || 0), 0);
    const totalQuantity = transactions.reduce((sum, tx) => sum + tx.quantity, 0);
    const uniqueCustomers = new Set(transactions.map(tx => tx.customerID)).size;
    const orderCount = new Set(transactions.map(tx => tx.invoiceNo)).size;
    const avgPrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;
    
    return { country, totalRevenue, totalQuantity, uniqueCustomers, orderCount, avgPrice };
  }).sort((a,b) => b.totalRevenue - a.totalRevenue);
  
  if (barChartFormat) {
    return { data: rawMetrics };
  }


  // Find max values for normalization (for Radar Chart)
  const maxRevenue = Math.max(...rawMetrics.map(m => m.totalRevenue));
  const maxQuantity = Math.max(...rawMetrics.map(m => m.totalQuantity));
  const maxCustomers = Math.max(...rawMetrics.map(m => m.uniqueCustomers));
  const maxOrders = Math.max(...rawMetrics.map(m => m.orderCount));
  const maxAvgPrice = Math.max(...rawMetrics.map(m => m.avgPrice));

  // Create normalized data structure for the chart
  const subjects = [
    { name: 'Total Revenue', key: 'totalRevenue', max: maxRevenue },
    { name: 'Unique Customers', key: 'uniqueCustomers', max: maxCustomers },
    { name: 'Order Count', key: 'orderCount', max: maxOrders },
    { name: 'Total Quantity', key: 'totalQuantity', max: maxQuantity },
    { name: 'Avg. Price', key: 'avgPrice', max: maxAvgPrice },
  ];

  const chartData = subjects.map(subject => {
    const entry: { [key: string]: any } = { subject: subject.name };
    rawMetrics.forEach(metric => {
      // Handle 'United Kingdom' -> 'UK' mapping for shorter legend key
      const countryKey = metric.country === 'United Kingdom' ? 'UK' : metric.country;
      // @ts-ignore
      const value = metric[subject.key];
      entry[countryKey] = subject.max > 0 ? value / subject.max : 0;
    });
    return entry;
  });

  const countryConfig = [
    { name: 'UK', color: 'hsl(var(--chart-1))' },
    { name: 'Germany', color: 'hsl(var(--chart-2))' },
    { name: 'France', color: 'hsl(var(--chart-3))' },
    { name: 'Netherlands', color: 'hsl(var(--chart-4))' },
    { name: 'EIRE', color: 'hsl(var(--chart-5))' },
  ];

  return { data: chartData, countries: countryConfig };
};

export const mockCampaignData = [
  { id: 'cam-01', name: 'Summer Sale', roas: 4.2, budget: 50000, spend: 48000, conversions: 1200, status: 'Completed' },
  { id: 'cam-02', name: 'Q4 Brand Awareness', roas: 3.5, budget: 75000, spend: 70000, conversions: 850, status: 'Completed' },
  { id: 'cam-03', name: 'Product Launch: "Eco-Line"', roas: 5.1, budget: 60000, spend: 55000, conversions: 1500, status: 'Completed' },
  { id: 'cam-04', name: 'Holiday Push', roas: 2.8, budget: 100000, spend: 110000, conversions: 1100, status: 'Over Budget' },
  { id: 'cam-05', name: 'Lead Gen (Social)', roas: 0, budget: 25000, spend: 15000, conversions: 300, status: 'Active' },
];

export const mockSentimentData = [
    { name: 'Positive', value: 65, fill: 'var(--chart-1)' },
    { name: 'Neutral', value: 25, fill: 'var(--chart-2)' },
    { name: 'Negative', value: 10, fill: 'var(--chart-3)' },
];

// Bertrand Duopoly Model
export const generateDuopolyData = (ourPrice: number, competitorPrice: number, scenario: MarketScenario): DuopolyDataPoint[] => {
    const data: DuopolyDataPoint[] = [];

    for (let p = 50; p <= 150; p += 10) {
        let ourDemand = 0;
        let competitorDemand = 0;
        const baseDemand = 1000;

        switch (scenario) {
            case 'rational':
                if (p < competitorPrice) {
                    ourDemand = baseDemand - p + competitorPrice;
                    competitorDemand = 0;
                } else if (p > competitorPrice) {
                    ourDemand = 0;
                    competitorDemand = baseDemand - competitorPrice + p;
                } else {
                    ourDemand = (baseDemand - p) / 2;
                    competitorDemand = (baseDemand - competitorPrice) / 2;
                }
                break;

            case 'price_war':
                 // In a price war, if we lower our price, the competitor's revenue is also affected as they are assumed to follow.
                 // This is a simplified model where market share drastically shifts to the lower price.
                if (p < competitorPrice) {
                    ourDemand = baseDemand * 1.5 - (p * 2);
                    competitorDemand = baseDemand * 0.5 - (competitorPrice * 2);
                } else if (p > competitorPrice) {
                    ourDemand = baseDemand * 0.5 - (p * 2);
                    competitorDemand = baseDemand * 1.5 - (competitorPrice * 2);
                } else {
                    ourDemand = baseDemand - (p * 2);
                    competitorDemand = baseDemand - (competitorPrice * 2);
                }
                break;
            
            case 'brand_loyal':
                // Customers are less sensitive to our price changes
                ourDemand = (baseDemand * 1.2) - (p * 0.8) + (competitorPrice * 0.2);
                // Competitor's customers are also somewhat loyal
                competitorDemand = (baseDemand * 0.8) - (competitorPrice) + (p * 0.5);
                break;
        }

        data.push({
            ourPrice: p,
            competitorPrice: competitorPrice,
            ourDemand: Math.max(0, ourDemand),
            competitorDemand: Math.max(0, competitorDemand),
            ourRevenue: Math.max(0, ourDemand) * p,
            competitorRevenue: Math.max(0, competitorDemand) * competitorPrice
        });
    }
    return data;
};
