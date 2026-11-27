"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_APP_STATE } from "@/data/seed";
import {
  loadCloudState,
  sbDelete,
  sbUpsert,
  toLeadRow,
  toOppRow,
  toProjectRow,
  toPropertyRow,
} from "@/lib/supabaseSync";
import {
  AlertItem,
  AppState,
  Customer,
  Deal,
  DiscoveryItem,
  Employee,
  ExpansionSignal,
  Lead,
  MasterCatalog,
  Opportunity,
  Project,
  Property,
  WatchlistItem,
} from "@/types";

const STORAGE_KEY = "proppulse_ai_state_v1";

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  addLead: (lead: Omit<Lead, "id">) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  convertLeadToOpportunity: (leadId: string) => void;
  addOpportunity: (opp: Omit<Opportunity, "id">) => void;
  updateOpportunity: (opp: Opportunity) => void;
  deleteOpportunity: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addProperty: (property: Omit<Property, "id" | "createdAt">) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  addCustomer: (customer: Omit<Customer, "id">) => void;
  addDeal: (deal: Omit<Deal, "id">) => void;
  addEmployee: (emp: Omit<Employee, "id">) => void;
  updateEmployee: (emp: Employee) => void;
  addMasterValue: (key: keyof MasterCatalog, value: string) => void;
  removeMasterValue: (key: keyof MasterCatalog, value: string) => void;
  updateDiscoveryStatus: (id: string, status: DiscoveryItem["status"]) => void;
  addWatchlist: (item: Omit<WatchlistItem, "id" | "createdAt">) => void;
  removeWatchlist: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addSignal: (sig: Omit<ExpansionSignal, "id">) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_APP_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          const parsed = JSON.parse(saved) as AppState;
          if (parsed && parsed.leads && parsed.companies) {
            setState(parsed);
          }
        }
        const cloudPatch = await loadCloudState();
        if (cloudPatch && active && Object.keys(cloudPatch).length > 0) {
          setState((prev) => ({ ...prev, ...cloudPatch }));
        }
      } catch {
        // Fallback to initial seed
      } finally {
        if (active) setHydrated(true);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, hydrated]);

  const addLead = (lead: Omit<Lead, "id">) => {
    const id = `LD-${1000 + state.leads.length + Math.floor(Math.random() * 90 + 10)}`;
    const newLead: Lead = { ...lead, id };
    setState((prev) => ({
      ...prev,
      leads: [newLead, ...prev.leads],
    }));
    sbUpsert("leads", toLeadRow(newLead));
  };

  const updateLead = (lead: Lead) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === lead.id ? lead : l)),
    }));
    sbUpsert("leads", toLeadRow(lead));
  };

  const deleteLead = (id: string) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id),
    }));
    sbDelete("leads", id);
  };

  const convertLeadToOpportunity = (leadId: string) => {
    const lead = state.leads.find((l) => l.id === leadId);
    if (!lead) return;
    const oppId = `OPP-${2000 + state.opportunities.length + Math.floor(Math.random() * 90 + 10)}`;
    const today = new Date().toISOString().slice(0, 10);
    const newOpp: Opportunity = {
      id: oppId,
      leadId: lead.id,
      leadDate: lead.date,
      qualifyDate: today,
      assignTo: lead.assignTo,
      name: lead.name,
      mobile: lead.mobile,
      projectOrProperty: lead.projectRequirement || "General Requirement",
      businessType: lead.businessType,
      estimatedValue: 10000000,
      status: "Open",
      stage: "Qualification",
      lostReason: "",
      nextFollowUp: lead.nextFollowUp || today,
      specialNotes: lead.specialNotes,
    };
    const newAlert: AlertItem = {
      id: `ALT-${Date.now()}`,
      title: `Lead Converted: ${lead.name}`,
      message: `${lead.id} converted to Opportunity ${oppId}.`,
      severity: "Info",
      module: "CRM",
      timestamp: new Date().toLocaleString(),
      read: false,
    };
    const updatedLead: Lead = { ...lead, status: "Converted" };
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === leadId ? updatedLead : l)),
      opportunities: [newOpp, ...prev.opportunities],
      alerts: [newAlert, ...prev.alerts],
    }));
    sbUpsert("leads", toLeadRow(updatedLead));
    sbUpsert("opportunities", toOppRow(newOpp));
    sbUpsert("alerts", { ...newAlert });
  };

  const addOpportunity = (opp: Omit<Opportunity, "id">) => {
    const id = `OPP-${2000 + state.opportunities.length + Math.floor(Math.random() * 90 + 10)}`;
    const newOpp: Opportunity = { ...opp, id };
    setState((prev) => ({
      ...prev,
      opportunities: [newOpp, ...prev.opportunities],
    }));
    sbUpsert("opportunities", toOppRow(newOpp));
  };

  const updateOpportunity = (opp: Opportunity) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.map((o) => (o.id === opp.id ? opp : o)),
    }));
    sbUpsert("opportunities", toOppRow(opp));
  };

  const deleteOpportunity = (id: string) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.filter((o) => o.id !== id),
    }));
    sbDelete("opportunities", id);
  };

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const id = `PRJ-${3000 + state.projects.length + Math.floor(Math.random() * 90 + 10)}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    const newProject: Project = { ...project, id, createdAt };
    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    sbUpsert("projects", toProjectRow(newProject));
  };

  const updateProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
    sbUpsert("projects", toProjectRow(project));
  };

  const deleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    sbDelete("projects", id);
  };

  const addProperty = (property: Omit<Property, "id" | "createdAt">) => {
    const id = `PROP-${4000 + state.properties.length + Math.floor(Math.random() * 90 + 10)}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    const newProperty: Property = { ...property, id, createdAt };
    setState((prev) => ({
      ...prev,
      properties: [newProperty, ...prev.properties],
    }));
    sbUpsert("properties", toPropertyRow(newProperty));
  };

  const updateProperty = (property: Property) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) => (p.id === property.id ? property : p)),
    }));
    sbUpsert("properties", toPropertyRow(property));
  };

  const deleteProperty = (id: string) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p.id !== id),
    }));
    sbDelete("properties", id);
  };

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const id = `CUST-${500 + state.customers.length + 1}`;
    const newCust: Customer = { ...customer, id };
    setState((prev) => ({
      ...prev,
      customers: [newCust, ...prev.customers],
    }));
    sbUpsert("customers", {
      id: newCust.id,
      name: newCust.name,
      mobile: newCust.mobile,
      email: newCust.email,
      customer_type: newCust.customerType,
      profession: newCust.profession,
      city: newCust.city,
      total_deals: newCust.totalDeals,
    });
  };

  const addDeal = (deal: Omit<Deal, "id">) => {
    const id = `DEAL-${600 + state.deals.length + 1}`;
    const newDeal: Deal = { ...deal, id };
    setState((prev) => ({
      ...prev,
      deals: [newDeal, ...prev.deals],
    }));
    sbUpsert("deals", {
      id: newDeal.id,
      customer_name: newDeal.customerName,
      property_title: newDeal.propertyTitle,
      transaction_type: newDeal.transactionType,
      deal_value: newDeal.dealValue,
      commission_amount: newDeal.commissionAmount,
      executive: newDeal.executive,
      closed_date: newDeal.closedDate,
      status: newDeal.status,
    });
  };

  const addEmployee = (emp: Omit<Employee, "id">) => {
    const id = `EMP-${String(state.employees.length + 1).padStart(2, "0")}`;
    const newEmp: Employee = { ...emp, id };
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, newEmp],
    }));
    sbUpsert("employees", { ...newEmp });
  };

  const updateEmployee = (emp: Employee) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => (e.id === emp.id ? emp : e)),
    }));
    sbUpsert("employees", { ...emp });
  };

  const addMasterValue = (key: keyof MasterCatalog, value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setState((prev) => {
      if (prev.masters[key].includes(clean)) return prev;
      return {
        ...prev,
        masters: {
          ...prev.masters,
          [key]: [...prev.masters[key], clean],
        },
      };
    });
  };

  const removeMasterValue = (key: keyof MasterCatalog, value: string) => {
    setState((prev) => ({
      ...prev,
      masters: {
        ...prev.masters,
        [key]: prev.masters[key].filter((v) => v !== value),
      },
    }));
  };

  const updateDiscoveryStatus = (id: string, status: DiscoveryItem["status"]) => {
    setState((prev) => {
      const target = prev.discoveries.find((d) => d.id === id);
      const nextBranches =
        status === "Approved" && target
          ? [
              {
                id: `BR-${Date.now()}`,
                companyId: "CMP-01",
                companyName: target.name.split("-")[0].trim(),
                sector: target.sector,
                branchName: target.name,
                address: target.address,
                neighborhood: target.neighborhood,
                city: "Ahmedabad",
                lat: target.lat,
                lng: target.lng,
                source: "OpenStreetMap" as const,
                status: "Verified" as const,
              },
              ...prev.branches,
            ]
          : prev.branches;

      return {
        ...prev,
        discoveries: prev.discoveries.map((d) =>
          d.id === id ? { ...d, status } : d
        ),
        branches: nextBranches,
      };
    });
  };

  const addWatchlist = (item: Omit<WatchlistItem, "id" | "createdAt">) => {
    const id = `WL-${Date.now()}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    const newItem: WatchlistItem = { ...item, id, createdAt };
    setState((prev) => ({
      ...prev,
      watchlists: [newItem, ...prev.watchlists],
    }));
    sbUpsert("watchlists", {
      id: newItem.id,
      name: newItem.name,
      type: newItem.type,
      target: newItem.target,
      city: newItem.city,
      alerts_enabled: newItem.alertsEnabled,
      created_at: newItem.createdAt,
    });
  };

  const removeWatchlist = (id: string) => {
    setState((prev) => ({
      ...prev,
      watchlists: prev.watchlists.filter((w) => w.id !== id),
    }));
    sbDelete("watchlists", id);
  };

  const markAlertRead = (id: string) => {
    const target = state.alerts.find((a) => a.id === id);
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    }));
    if (target) {
      sbUpsert("alerts", { ...target, read: true });
    }
  };

  const markAllAlertsRead = () => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => ({ ...a, read: true })),
    }));
    state.alerts.forEach((a) => {
      if (!a.read) sbUpsert("alerts", { ...a, read: true });
    });
  };

  const addSignal = (sig: Omit<ExpansionSignal, "id">) => {
    const id = `SIG-${Date.now()}`;
    const newSig: ExpansionSignal = { ...sig, id };
    setState((prev) => ({
      ...prev,
      signals: [newSig, ...prev.signals],
    }));
    sbUpsert("expansion_signals", {
      id: newSig.id,
      company_id: newSig.companyId,
      company_name: newSig.companyName,
      sector: newSig.sector,
      signal_type: newSig.signalType,
      confidence: newSig.confidence,
      neighborhood: newSig.neighborhood,
      city: newSig.city,
      title: newSig.title,
      summary: newSig.summary,
      source_name: newSig.sourceName,
      detected_at: newSig.detectedAt,
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_APP_STATE);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        hydrated,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToOpportunity,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        addProject,
        updateProject,
        deleteProject,
        addProperty,
        updateProperty,
        deleteProperty,
        addCustomer,
        addDeal,
        addEmployee,
        updateEmployee,
        addMasterValue,
        removeMasterValue,
        updateDiscoveryStatus,
        addWatchlist,
        removeWatchlist,
        markAlertRead,
        markAllAlertsRead,
        addSignal,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
