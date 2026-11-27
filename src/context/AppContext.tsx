"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_APP_STATE } from "@/data/seed";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
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
        const sb = getSupabaseClient();
        if (sb && isSupabaseConfigured) {
          const { data: leadsData } = await sb.from("leads").select("*").limit(200);
          if (leadsData && leadsData.length > 0 && active) {
            setState((prev) => ({
              ...prev,
              leads: leadsData.map((r) => ({
                id: r.id,
                date: r.date,
                assignTo: r.assign_to || "",
                name: r.name,
                mobile: r.mobile,
                email: r.email || "",
                businessType: r.business_type,
                category: r.category || r.business_type,
                subcategory: r.subcategory || "",
                residentialStructure: r.residential_structure || "",
                budgetRange: r.budget_range || "",
                projectRequirement: r.project_requirement || "",
                source: r.source || "",
                status: r.status,
                priority: r.priority,
                nextFollowUp: r.next_follow_up || "",
                visitDone: Boolean(r.visit_done),
                dealDone: Boolean(r.deal_done),
                specialNotes: r.special_notes || "",
              })),
            }));
          }
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
    const sb = getSupabaseClient();
    if (sb) {
      void sb.from("leads").upsert({
        id: newLead.id,
        date: newLead.date,
        assign_to: newLead.assignTo,
        name: newLead.name,
        mobile: newLead.mobile,
        email: newLead.email,
        business_type: newLead.businessType,
        category: newLead.category,
        subcategory: newLead.subcategory,
        residential_structure: newLead.residentialStructure,
        budget_range: newLead.budgetRange,
        project_requirement: newLead.projectRequirement,
        source: newLead.source,
        status: newLead.status,
        priority: newLead.priority,
        next_follow_up: newLead.nextFollowUp,
        visit_done: newLead.visitDone,
        deal_done: newLead.dealDone,
        special_notes: newLead.specialNotes,
      });
    }
  };

  const updateLead = (lead: Lead) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === lead.id ? lead : l)),
    }));
  };

  const deleteLead = (id: string) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.filter((l) => l.id !== id),
    }));
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
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === leadId ? { ...l, status: "Converted" } : l
      ),
      opportunities: [newOpp, ...prev.opportunities],
      alerts: [newAlert, ...prev.alerts],
    }));
  };

  const addOpportunity = (opp: Omit<Opportunity, "id">) => {
    const id = `OPP-${2000 + state.opportunities.length + Math.floor(Math.random() * 90 + 10)}`;
    setState((prev) => ({
      ...prev,
      opportunities: [{ ...opp, id }, ...prev.opportunities],
    }));
  };

  const updateOpportunity = (opp: Opportunity) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.map((o) => (o.id === opp.id ? opp : o)),
    }));
  };

  const deleteOpportunity = (id: string) => {
    setState((prev) => ({
      ...prev,
      opportunities: prev.opportunities.filter((o) => o.id !== id),
    }));
  };

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const id = `PRJ-${3000 + state.projects.length + Math.floor(Math.random() * 90 + 10)}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setState((prev) => ({
      ...prev,
      projects: [{ ...project, id, createdAt }, ...prev.projects],
    }));
  };

  const updateProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addProperty = (property: Omit<Property, "id" | "createdAt">) => {
    const id = `PROP-${4000 + state.properties.length + Math.floor(Math.random() * 90 + 10)}`;
    const createdAt = new Date().toISOString().slice(0, 10);
    setState((prev) => ({
      ...prev,
      properties: [{ ...property, id, createdAt }, ...prev.properties],
    }));
  };

  const updateProperty = (property: Property) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.map((p) => (p.id === property.id ? property : p)),
    }));
  };

  const deleteProperty = (id: string) => {
    setState((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p.id !== id),
    }));
  };

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const id = `CUST-${500 + state.customers.length + 1}`;
    setState((prev) => ({
      ...prev,
      customers: [{ ...customer, id }, ...prev.customers],
    }));
  };

  const addDeal = (deal: Omit<Deal, "id">) => {
    const id = `DEAL-${600 + state.deals.length + 1}`;
    setState((prev) => ({
      ...prev,
      deals: [{ ...deal, id }, ...prev.deals],
    }));
  };

  const addEmployee = (emp: Omit<Employee, "id">) => {
    const id = `EMP-${String(state.employees.length + 1).padStart(2, "0")}`;
    setState((prev) => ({
      ...prev,
      employees: [...prev.employees, { ...emp, id }],
    }));
  };

  const updateEmployee = (emp: Employee) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((e) => (e.id === emp.id ? emp : e)),
    }));
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
    setState((prev) => ({
      ...prev,
      watchlists: [{ ...item, id, createdAt }, ...prev.watchlists],
    }));
  };

  const removeWatchlist = (id: string) => {
    setState((prev) => ({
      ...prev,
      watchlists: prev.watchlists.filter((w) => w.id !== id),
    }));
  };

  const markAlertRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    }));
  };

  const markAllAlertsRead = () => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => ({ ...a, read: true })),
    }));
  };

  const addSignal = (sig: Omit<ExpansionSignal, "id">) => {
    const id = `SIG-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      signals: [{ ...sig, id }, ...prev.signals],
    }));
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
