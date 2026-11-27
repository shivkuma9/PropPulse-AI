export type BusinessType = "Residential" | "Commercial" | "Industrial" | "Land/Plot";

export interface Lead {
  id: string;
  date: string;
  assignTo: string;
  name: string;
  mobile: string;
  email: string;
  businessType: BusinessType;
  category: string;
  subcategory: string;
  residentialStructure: string;
  budgetRange: string;
  projectRequirement: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Site Visit" | "Converted" | "Closed";
  priority: "High" | "Medium" | "Low";
  nextFollowUp: string;
  visitDone: boolean;
  dealDone: boolean;
  specialNotes: string;
}

export interface Opportunity {
  id: string;
  leadId: string;
  leadDate: string;
  qualifyDate: string;
  assignTo: string;
  name: string;
  mobile: string;
  projectOrProperty: string;
  businessType: BusinessType;
  estimatedValue: number;
  status: "Open" | "Won" | "Lost" | "On Hold";
  stage: "Qualification" | "Site Visit" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  lostReason: string;
  nextFollowUp: string;
  specialNotes: string;
}

export interface BankDetail {
  bankName: string;
  accountNo: string;
  ifsc: string;
  address: string;
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  stage: string;
  category: BusinessType;
  segment: string;
  specification: string;
  availability: "Available" | "Limited" | "Sold Out";
  totalArea: number;
  areaUnit: string;
  packagePrice: number;
  packageContents: string;
  rateOfLand: number;
  loanAmount: number;
  reraRegistered: boolean;
  reraNumber: string;
  developmentAuthority: string;
  electricityProvider: string;
  bankTieUp: string;
  amenities: string[];
  livability: string;
  city: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  commissionMethod: "Percentage" | "Fixed";
  commissionValue: number;
  bankDetails: BankDetail[];
  shareEmail: boolean;
  shareSms: boolean;
  terms: string;
  createdAt: string;
}

export interface PropertyDocument {
  type: string;
  name: string;
  description: string;
  isDefault: boolean;
}

export interface Property {
  id: string;
  projectId: string;
  projectName: string;
  transactionType: "Sale" | "Rent" | "Lease";
  category: BusinessType;
  subcategory: string;
  propertyType: string;
  residentialStructure: string;
  floor: string;
  furnished: string;
  doorFacing: string;
  unitNo: string;
  buildingBlock: string;
  carpetArea: number;
  superBuiltUpArea: number;
  areaUnit: string;
  price: number;
  otherCharges: number;
  representative: string;
  ownerName: string;
  ownerMobile: string;
  contactType: string;
  country: string;
  state: string;
  city: string;
  area: string;
  address: string;
  landmark: string;
  pincode: string;
  lat: number;
  lng: number;
  possessionStatus: string;
  status: "Active" | "Inactive" | "Sold" | "Rented";
  source: string;
  windowView: string;
  commissionMethod: "Percentage" | "Fixed";
  commissionValue: number;
  bankDetails: BankDetail[];
  documents: PropertyDocument[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  customerType: string;
  profession: string;
  city: string;
  totalDeals: number;
}

export interface Deal {
  id: string;
  customerName: string;
  propertyTitle: string;
  transactionType: "Sale" | "Rent" | "Lease";
  dealValue: number;
  commissionAmount: number;
  executive: string;
  closedDate: string;
  status: "Completed" | "In Progress" | "Pending Docs";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  role: "Admin" | "Sales Manager" | "Sales Executive" | "Inventory Coordinator";
  status: "Active" | "Inactive";
}

export interface MasterCatalog {
  propertyCategories: string[];
  propertySubcategories: string[];
  residentialStructures: string[];
  furnishingTypes: string[];
  possessionStatuses: string[];
  doorFacings: string[];
  units: string[];
  amenities: string[];
  projectStages: string[];
  projectSegments: string[];
  developmentAuthorities: string[];
  electricityProviders: string[];
  opportunityStages: string[];
  lostReasons: string[];
  leadSources: string[];
  cities: string[];
  areas: string[];
  customerTypes: string[];
  documentTypes: string[];
}

export type MarketSector =
  | "Banking & Finance"
  | "Retail & QSR"
  | "Healthcare & Pharma"
  | "Tech & Coworking"
  | "Real Estate & Developers";

export interface MarketCompany {
  id: string;
  name: string;
  sector: MarketSector;
  city: string;
  branchCount: number;
  growthRate: string;
  verified: boolean;
  hq: string;
  description: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface MarketBranch {
  id: string;
  companyId: string;
  companyName: string;
  sector: MarketSector;
  branchName: string;
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  source: "OpenStreetMap" | "Google Places" | "Verified Registry";
  status: "Verified" | "Unverified";
}

export interface NeighborhoodOpportunity {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  opportunityScore: number;
  residentialDensity: number;
  commercialVitality: number;
  competitorCount: number;
  avgLeaseRateSqFt: number;
  recommendedSectors: MarketSector[];
  rationale: string;
}

export interface ExpansionSignal {
  id: string;
  companyId: string;
  companyName: string;
  sector: MarketSector;
  signalType: "Active Opening" | "Lease Signed" | "Hiring Surge";
  confidence: "High" | "Medium" | "Low";
  neighborhood: string;
  city: string;
  title: string;
  summary: string;
  sourceName: string;
  detectedAt: string;
}

export interface CommercialHub {
  id: string;
  name: string;
  type: "Office Park" | "Tech Hub" | "Corporate Tower" | "Shopping Mall";
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  totalSqFt: number;
  occupancyPct: number;
  leasingVelocity: "High" | "Moderate" | "Stable";
  anchorTenants: string[];
  vacantUnits: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  sector: MarketSector;
  brands: string[];
  summary: string;
  verified: boolean;
}

export interface DiscoveryItem {
  id: string;
  name: string;
  sector: MarketSector;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  source: "OpenStreetMap Overpass" | "RSS Feed";
  confidence: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Merged" | "Rejected";
}

export interface WatchlistItem {
  id: string;
  name: string;
  type: "Company" | "Neighborhood" | "Sector";
  target: string;
  city: string;
  alertsEnabled: boolean;
  createdAt: string;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "Critical Opportunity" | "Warning" | "Info";
  module: "Expansion" | "CRM" | "Inventory" | "Market";
  timestamp: string;
  read: boolean;
}

export interface AppState {
  leads: Lead[];
  opportunities: Opportunity[];
  projects: Project[];
  properties: Property[];
  customers: Customer[];
  deals: Deal[];
  employees: Employee[];
  masters: MasterCatalog;
  companies: MarketCompany[];
  branches: MarketBranch[];
  neighborhoods: NeighborhoodOpportunity[];
  signals: ExpansionSignal[];
  commercialHubs: CommercialHub[];
  news: NewsArticle[];
  discoveries: DiscoveryItem[];
  watchlists: WatchlistItem[];
  alerts: AlertItem[];
}
