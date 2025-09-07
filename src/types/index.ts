// src/types/index.ts
import { z } from 'zod';

export enum UserRoleType {
  USER = "user", // Represents roles like CEO, CFO, etc.
  ADMINISTRATOR = "administrator",
}

export enum UserSpecificRole {
  CEO = "CEO",
  CFO = "CFO",
  INVENTORY_HEAD = "Inventory Head",
  SALES_MANAGER = "Sales Manager",
  CMO = "CMO",
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  username: string;
  roleType: UserRoleType;
  specificRole?: UserSpecificRole; // This will be set if roleType is USER
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // HH:MM
  description?: string;
}

export interface FinancialRecord {
  month: string; // Could also be a Date or more specific time period
  revenue: number;
  expenses: number;
  profit: number;
}

export interface InventoryItem {
  id: string; // Could be StockCode
  name: string;
  category: string;
  stock: number;
  price: number; // UnitPrice
  supplier: string;
}

// Types for Online Retail II Dataset
export interface Product {
  stockCode: string;
  description: string;
  unitPrice: number; // Current or average unit price
  category?: string; // May need to be inferred or added
}

export interface Customer {
  customerID: string;
  country: string;
  // ML-derived fields can be added here later, e.g., segment, clusterId
}

export interface SalesTransaction {
  invoiceNo: string;
  stockCode: string; // Links to Product.stockCode
  description?: string; // Denormalized product description
  quantity: number;
  invoiceDate: string; // ISO date-time string
  unitPrice: number; // Price at the time of transaction
  customerID?: string; // Links to Customer.customerID, can be null for non-customer transactions
  country?: string; // Denormalized customer country
  isCancellation?: boolean; // True if InvoiceNo starts with 'C'
  totalPrice?: number; // Calculated: quantity * unitPrice
}

export interface ExpenseTransaction {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: string;
  description: string;
  vendor: string;
}

// Types for ML Model Outputs
export interface ClassificationInsight {
  itemId: string; // e.g., customerID for segmentation, or relevant ID for purchase likelihood
  customerName?: string;
  type: 'customerSegmentation' | 'purchaseLikelihood' | 'leadConversion' | 'otherClassification';
  predictedClass?: string; // e.g., 'High-Value Customer', 'Likely to Buy'
  probability?: number; // Confidence score (0.0 to 1.0)
  productName?: string;
  // Optional: for SHAP explainability - specific feature contributions
  featureContributions?: Array<{ feature: string; contribution: number }>;
}

export interface CustomerCluster {
  customerID: string; // Links to Customer.customerID
  clusterId: string | number; // e.g., 1, 'Cluster A', 'Frequent Shoppers'
  clusterLabel?: string; // Human-readable name for the cluster
  // Optional: for 2D visualization (e.g., from PCA/t-SNE)
  x?: number;
  y?: number;
  personaDescription?: string; // LLM generated description for the cluster/persona
}

export interface ForecastDataPoint {
  date: string; // ISO date string (e.g., '2024-12-01')
  itemName?: string; // Optional: for multi-item forecasting (e.g., 'total_revenue', 'SKU123_demand')
  predictedValue: number;
  confidenceIntervalLower?: number;
  confidenceIntervalUpper?: number;
  actualValue?: number; // For plotting actuals vs forecast
}

export interface AssociationRule {
  antecedents: string[];
  consequents: string[];
  confidence: number;
  lift: number;
  support: number;
}

export interface CountrySalesMetrics {
  country: string;
  totalRevenue: number;
  uniqueCustomers: number;
  orderCount: number;
  totalQuantity: number;
  avgPrice: number;
}

export interface PhillipsCurveDataPoint {
  unemployment: number;
  inflation: number;
}

export interface MonopolyDataPoint {
  quantity: number;
  demand: number | null;
  mr: number | null;
  mc: number | null;
  decisionPoint?: number | null; // Value at which MR=MC
  monopolyPrice?: number | null; // Price on demand curve at decision quantity
}

export interface ForecastingMethodsDataPoint {
  month: string;
  actual: number | null;
  ma: number | null;
  ewma: number | null;
  regression: number | null;
  forecastPoint?: number | null; // Value will be same as regression for forecast months
}

export type MarketScenario = 'rational' | 'price_war' | 'brand_loyal';
export interface DuopolyDataPoint {
    ourPrice: number;
    competitorPrice: number;
    ourDemand: number;
    competitorDemand: number;
    ourRevenue: number;
    competitorRevenue: number;
}


// Optional: For storing aggregated ML model performance metrics if needed later
export interface ModelPerformanceMetrics {
  modelId: string;
  modelType: 'classification' | 'clustering' | 'forecasting' | 'associationRules';
  lastTrained: string; // ISO date string
  metrics: Record<string, any>; // e.g., { accuracy: 0.95, f1Score: 0.92 } or { mape: 15.2 }
}

export const GeneratePricingStrategyInputSchema = z.object({
  marketType: z.enum(['duopoly', 'monopoly']).describe('The type of market structure.'),
  ourPrice: z.number().describe('Our proposed price for the product.'),
  competitorPrice: z.number().describe("The competitor's price for the same or a similar product."),
  scenario: z.enum(['rational', 'price_war', 'brand_loyal']).describe('The selected market scenario which governs competitor and customer behavior.'),
});
export type GeneratePricingStrategyInput = z.infer<typeof GeneratePricingStrategyInputSchema>;

export const GeneratePricingStrategyOutputSchema = z.object({
    headline: z.string().describe("A concise, one-sentence strategic headline summarizing the recommendation."),
    detailedAnalysis: z.string().describe("A detailed paragraph analyzing the current pricing scenario, explaining the likely outcome and the reasoning behind it."),
    keyFactors: z.array(z.string()).describe("A list of key factors or assumptions the AI considered, such as 'price elasticity', 'market share battle', or 'profit margin focus'.")
});
export type GeneratePricingStrategyOutput = z.infer<typeof GeneratePricingStrategyOutputSchema>;
