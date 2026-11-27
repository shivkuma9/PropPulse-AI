import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  AlertItem,
  AppState,
  Customer,
  Deal,
  Employee,
  ExpansionSignal,
  Lead,
  Opportunity,
  Project,
  Property,
  WatchlistItem,
} from "@/types";

export function toLeadRow(l: Lead) {
  return {
    id: l.id,
    date: l.date,
    assign_to: l.assignTo,
    name: l.name,
    mobile: l.mobile,
    email: l.email,
    business_type: l.businessType,
    category: l.category,
    subcategory: l.subcategory,
    residential_structure: l.residentialStructure,
    budget_range: l.budgetRange,
    project_requirement: l.projectRequirement,
    source: l.source,
    status: l.status,
    priority: l.priority,
    next_follow_up: l.nextFollowUp,
    visit_done: l.visitDone,
    deal_done: l.dealDone,
    special_notes: l.specialNotes,
  };
}

export function fromLeadRow(r: Record<string, unknown>): Lead {
  return {
    id: String(r.id),
    date: String(r.date || ""),
    assignTo: String(r.assign_to || ""),
    name: String(r.name || ""),
    mobile: String(r.mobile || ""),
    email: String(r.email || ""),
    businessType: (r.business_type as Lead["businessType"]) || "Residential",
    category: String(r.category || r.business_type || "Residential"),
    subcategory: String(r.subcategory || ""),
    residentialStructure: String(r.residential_structure || ""),
    budgetRange: String(r.budget_range || ""),
    projectRequirement: String(r.project_requirement || ""),
    source: String(r.source || ""),
    status: (r.status as Lead["status"]) || "New",
    priority: (r.priority as Lead["priority"]) || "Medium",
    nextFollowUp: String(r.next_follow_up || ""),
    visitDone: Boolean(r.visit_done),
    dealDone: Boolean(r.deal_done),
    specialNotes: String(r.special_notes || ""),
  };
}

export function toOppRow(o: Opportunity) {
  return {
    id: o.id,
    lead_id: o.leadId,
    lead_date: o.leadDate,
    qualify_date: o.qualifyDate,
    assign_to: o.assignTo,
    name: o.name,
    mobile: o.mobile,
    project_or_property: o.projectOrProperty,
    business_type: o.businessType,
    estimated_value: o.estimatedValue,
    status: o.status,
    stage: o.stage,
    lost_reason: o.lostReason,
    next_follow_up: o.nextFollowUp,
    special_notes: o.specialNotes,
  };
}

export function fromOppRow(r: Record<string, unknown>): Opportunity {
  return {
    id: String(r.id),
    leadId: String(r.lead_id || ""),
    leadDate: String(r.lead_date || ""),
    qualifyDate: String(r.qualify_date || ""),
    assignTo: String(r.assign_to || ""),
    name: String(r.name || ""),
    mobile: String(r.mobile || ""),
    projectOrProperty: String(r.project_or_property || ""),
    businessType: (r.business_type as Opportunity["businessType"]) || "Residential",
    estimatedValue: Number(r.estimated_value || 0),
    status: (r.status as Opportunity["status"]) || "Open",
    stage: (r.stage as Opportunity["stage"]) || "Qualification",
    lostReason: String(r.lost_reason || ""),
    nextFollowUp: String(r.next_follow_up || ""),
    specialNotes: String(r.special_notes || ""),
  };
}

export function toProjectRow(p: Project) {
  return {
    id: p.id,
    name: p.name,
    developer: p.developer,
    stage: p.stage,
    category: p.category,
    segment: p.segment,
    specification: p.specification,
    availability: p.availability,
    total_area: p.totalArea,
    area_unit: p.areaUnit,
    package_price: p.packagePrice,
    package_contents: p.packageContents,
    rate_of_land: p.rateOfLand,
    loan_amount: p.loanAmount,
    rera_registered: p.reraRegistered,
    rera_number: p.reraNumber,
    development_authority: p.developmentAuthority,
    electricity_provider: p.electricityProvider,
    bank_tie_up: p.bankTieUp,
    amenities: p.amenities,
    livability: p.livability,
    city: p.city,
    area: p.area,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    commission_method: p.commissionMethod,
    commission_value: p.commissionValue,
    bank_details: p.bankDetails,
    share_email: p.shareEmail,
    share_sms: p.shareSms,
    terms: p.terms,
    created_at: p.createdAt,
  };
}

export function fromProjectRow(r: Record<string, unknown>): Project {
  return {
    id: String(r.id),
    name: String(r.name || ""),
    developer: String(r.developer || ""),
    stage: String(r.stage || "Under Construction"),
    category: (r.category as Project["category"]) || "Residential",
    segment: String(r.segment || ""),
    specification: String(r.specification || ""),
    availability: (r.availability as Project["availability"]) || "Available",
    totalArea: Number(r.total_area || 0),
    areaUnit: String(r.area_unit || "Sq. Ft."),
    packagePrice: Number(r.package_price || 0),
    packageContents: String(r.package_contents || ""),
    rateOfLand: Number(r.rate_of_land || 0),
    loanAmount: Number(r.loan_amount || 0),
    reraRegistered: Boolean(r.rera_registered),
    reraNumber: String(r.rera_number || ""),
    developmentAuthority: String(r.development_authority || ""),
    electricityProvider: String(r.electricity_provider || ""),
    bankTieUp: String(r.bank_tie_up || ""),
    amenities: Array.isArray(r.amenities) ? (r.amenities as string[]) : [],
    livability: String(r.livability || ""),
    city: String(r.city || "Ahmedabad"),
    area: String(r.area || ""),
    address: String(r.address || ""),
    lat: Number(r.lat || 23.0338),
    lng: Number(r.lng || 72.5082),
    commissionMethod: (r.commission_method as Project["commissionMethod"]) || "Percentage",
    commissionValue: Number(r.commission_value || 0),
    bankDetails: Array.isArray(r.bank_details) ? (r.bank_details as Project["bankDetails"]) : [],
    shareEmail: Boolean(r.share_email),
    shareSms: Boolean(r.share_sms),
    terms: String(r.terms || ""),
    createdAt: String(r.created_at || ""),
  };
}

export function toPropertyRow(p: Property) {
  return {
    id: p.id,
    project_id: p.projectId,
    project_name: p.projectName,
    transaction_type: p.transactionType,
    category: p.category,
    subcategory: p.subcategory,
    property_type: p.propertyType,
    residential_structure: p.residentialStructure,
    floor: p.floor,
    furnished: p.furnished,
    door_facing: p.doorFacing,
    unit_no: p.unitNo,
    building_block: p.buildingBlock,
    carpet_area: p.carpetArea,
    super_built_up_area: p.superBuiltUpArea,
    area_unit: p.areaUnit,
    price: p.price,
    other_charges: p.otherCharges,
    representative: p.representative,
    owner_name: p.ownerName,
    owner_mobile: p.ownerMobile,
    contact_type: p.contactType,
    country: p.country,
    state: p.state,
    city: p.city,
    area: p.area,
    address: p.address,
    landmark: p.landmark,
    pincode: p.pincode,
    lat: p.lat,
    lng: p.lng,
    possession_status: p.possessionStatus,
    status: p.status,
    source: p.source,
    window_view: p.windowView,
    commission_method: p.commissionMethod,
    commission_value: p.commissionValue,
    bank_details: p.bankDetails,
    documents: p.documents,
    created_at: p.createdAt,
  };
}

export function fromPropertyRow(r: Record<string, unknown>): Property {
  return {
    id: String(r.id),
    projectId: String(r.project_id || ""),
    projectName: String(r.project_name || ""),
    transactionType: (r.transaction_type as Property["transactionType"]) || "Sale",
    category: (r.category as Property["category"]) || "Residential",
    subcategory: String(r.subcategory || ""),
    propertyType: String(r.property_type || ""),
    residentialStructure: String(r.residential_structure || ""),
    floor: String(r.floor || ""),
    furnished: String(r.furnished || ""),
    doorFacing: String(r.door_facing || ""),
    unitNo: String(r.unit_no || ""),
    buildingBlock: String(r.building_block || ""),
    carpetArea: Number(r.carpet_area || 0),
    superBuiltUpArea: Number(r.super_built_up_area || 0),
    areaUnit: String(r.area_unit || "Sq. Ft."),
    price: Number(r.price || 0),
    otherCharges: Number(r.other_charges || 0),
    representative: String(r.representative || ""),
    ownerName: String(r.owner_name || ""),
    ownerMobile: String(r.owner_mobile || ""),
    contactType: String(r.contact_type || ""),
    country: String(r.country || "India"),
    state: String(r.state || "Gujarat"),
    city: String(r.city || "Ahmedabad"),
    area: String(r.area || ""),
    address: String(r.address || ""),
    landmark: String(r.landmark || ""),
    pincode: String(r.pincode || ""),
    lat: Number(r.lat || 23.034),
    lng: Number(r.lng || 72.508),
    possessionStatus: String(r.possession_status || ""),
    status: (r.status as Property["status"]) || "Active",
    source: String(r.source || ""),
    windowView: String(r.window_view || ""),
    commissionMethod: (r.commission_method as Property["commissionMethod"]) || "Percentage",
    commissionValue: Number(r.commission_value || 0),
    bankDetails: Array.isArray(r.bank_details) ? (r.bank_details as Property["bankDetails"]) : [],
    documents: Array.isArray(r.documents) ? (r.documents as Property["documents"]) : [],
    createdAt: String(r.created_at || ""),
  };
}

export async function loadCloudState(): Promise<Partial<AppState> | null> {
  const sb = getSupabaseClient();
  if (!sb || !isSupabaseConfigured) return null;

  const [
    leadsRes,
    oppsRes,
    projectsRes,
    propsRes,
    custRes,
    dealsRes,
    empRes,
    sigRes,
    wlRes,
    altRes,
  ] = await Promise.all([
    sb.from("leads").select("*").limit(200),
    sb.from("opportunities").select("*").limit(200),
    sb.from("projects").select("*").limit(200),
    sb.from("properties").select("*").limit(300),
    sb.from("customers").select("*").limit(200),
    sb.from("deals").select("*").limit(200),
    sb.from("employees").select("*").limit(100),
    sb.from("expansion_signals").select("*").limit(200),
    sb.from("watchlists").select("*").limit(100),
    sb.from("alerts").select("*").limit(200),
  ]);

  const patch: Partial<AppState> = {};

  if (leadsRes.data && leadsRes.data.length > 0) {
    patch.leads = leadsRes.data.map(fromLeadRow);
  }
  if (oppsRes.data && oppsRes.data.length > 0) {
    patch.opportunities = oppsRes.data.map(fromOppRow);
  }
  if (projectsRes.data && projectsRes.data.length > 0) {
    patch.projects = projectsRes.data.map(fromProjectRow);
  }
  if (propsRes.data && propsRes.data.length > 0) {
    patch.properties = propsRes.data.map(fromPropertyRow);
  }
  if (custRes.data && custRes.data.length > 0) {
    patch.customers = custRes.data.map((r) => ({
      id: String(r.id),
      name: String(r.name || ""),
      mobile: String(r.mobile || ""),
      email: String(r.email || ""),
      customerType: String(r.customer_type || ""),
      profession: String(r.profession || ""),
      city: String(r.city || "Ahmedabad"),
      totalDeals: Number(r.total_deals || 0),
    })) as Customer[];
  }
  if (dealsRes.data && dealsRes.data.length > 0) {
    patch.deals = dealsRes.data.map((r) => ({
      id: String(r.id),
      customerName: String(r.customer_name || ""),
      propertyTitle: String(r.property_title || ""),
      transactionType: (r.transaction_type as Deal["transactionType"]) || "Sale",
      dealValue: Number(r.deal_value || 0),
      commissionAmount: Number(r.commission_amount || 0),
      executive: String(r.executive || ""),
      closedDate: String(r.closed_date || ""),
      status: (r.status as Deal["status"]) || "In Progress",
    })) as Deal[];
  }
  if (empRes.data && empRes.data.length > 0) {
    patch.employees = empRes.data.map((r) => ({
      id: String(r.id),
      name: String(r.name || ""),
      email: String(r.email || ""),
      mobile: String(r.mobile || ""),
      department: String(r.department || ""),
      designation: String(r.designation || ""),
      role: (r.role as Employee["role"]) || "Sales Executive",
      status: (r.status as Employee["status"]) || "Active",
    })) as Employee[];
  }
  if (sigRes.data && sigRes.data.length > 0) {
    patch.signals = sigRes.data.map((r) => ({
      id: String(r.id),
      companyId: String(r.company_id || ""),
      companyName: String(r.company_name || ""),
      sector: (r.sector as ExpansionSignal["sector"]) || "Banking & Finance",
      signalType: (r.signal_type as ExpansionSignal["signalType"]) || "Active Opening",
      confidence: (r.confidence as ExpansionSignal["confidence"]) || "Medium",
      neighborhood: String(r.neighborhood || ""),
      city: String(r.city || "Ahmedabad"),
      title: String(r.title || ""),
      summary: String(r.summary || ""),
      sourceName: String(r.source_name || ""),
      detectedAt: String(r.detected_at || ""),
    })) as ExpansionSignal[];
  }
  if (wlRes.data && wlRes.data.length > 0) {
    patch.watchlists = wlRes.data.map((r) => ({
      id: String(r.id),
      name: String(r.name || ""),
      type: (r.type as WatchlistItem["type"]) || "Neighborhood",
      target: String(r.target || ""),
      city: String(r.city || "Ahmedabad"),
      alertsEnabled: Boolean(r.alerts_enabled),
      createdAt: String(r.created_at || ""),
    })) as WatchlistItem[];
  }
  if (altRes.data && altRes.data.length > 0) {
    patch.alerts = altRes.data.map((r) => ({
      id: String(r.id),
      title: String(r.title || ""),
      message: String(r.message || ""),
      severity: (r.severity as AlertItem["severity"]) || "Info",
      module: (r.module as AlertItem["module"]) || "CRM",
      timestamp: String(r.timestamp || ""),
      read: Boolean(r.read),
    })) as AlertItem[];
  }

  return patch;
}

export function sbUpsert(table: string, row: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (sb) {
    void sb.from(table).upsert(row);
  }
}

export function sbDelete(table: string, id: string) {
  const sb = getSupabaseClient();
  if (sb) {
    void sb.from(table).delete().eq("id", id);
  }
}
