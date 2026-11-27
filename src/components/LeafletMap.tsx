"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import {
  CommercialHub,
  MarketBranch,
  NeighborhoodOpportunity,
  Project,
  Property,
} from "@/types";
import { formatINR } from "@/lib/format";

interface LeafletMapProps {
  projects: Project[];
  properties: Property[];
  branches: MarketBranch[];
  neighborhoods: NeighborhoodOpportunity[];
  hubs: CommercialHub[];
  layers: {
    projects: boolean;
    properties: boolean;
    branches: boolean;
    opportunities: boolean;
    hubs: boolean;
  };
}

export default function LeafletMap({
  projects,
  properties,
  branches,
  neighborhoods,
  hubs,
  layers,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([23.0338, 72.5015], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const group = layerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (layers.opportunities) {
      neighborhoods.forEach((nb) => {
        L.circle([nb.lat, nb.lng], {
          radius: 750,
          color: nb.opportunityScore >= 85 ? "#10b981" : "#f59e0b",
          fillColor: nb.opportunityScore >= 85 ? "#10b981" : "#f59e0b",
          fillOpacity: 0.16,
          weight: 1.5,
        })
          .bindPopup(
            `<div style="font-size:12px"><strong>${nb.name}</strong><br/>Opportunity Score: <b>${nb.opportunityScore}/100</b><br/>Avg Lease: ₹${nb.avgLeaseRateSqFt}/sq.ft</div>`
          )
          .addTo(group);
      });
    }

    if (layers.projects) {
      projects.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 9,
          color: "#312e81",
          fillColor: "#4f46e5",
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(
            `<div style="font-size:12px"><strong>Project: ${p.name}</strong><br/>${p.category} • ${p.stage}<br/>Package: ${formatINR(p.packagePrice)}<br/>${p.area}</div>`
          )
          .addTo(group);
      });
    }

    if (layers.properties) {
      properties.forEach((prop) => {
        L.circleMarker([prop.lat, prop.lng], {
          radius: 7,
          color: "#065f46",
          fillColor: "#10b981",
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(
            `<div style="font-size:12px"><strong>Unit: ${prop.projectName} (${prop.unitNo})</strong><br/>${prop.transactionType} • ${prop.residentialStructure}<br/>Price: ${formatINR(prop.price)}</div>`
          )
          .addTo(group);
      });
    }

    if (layers.branches) {
      branches.forEach((b) => {
        L.circleMarker([b.lat, b.lng], {
          radius: 6,
          color: "#9f1239",
          fillColor: "#f43f5e",
          fillOpacity: 0.85,
          weight: 1.5,
        })
          .bindPopup(
            `<div style="font-size:12px"><strong>${b.branchName}</strong><br/>${b.sector}<br/>Source: ${b.source} (${b.status})</div>`
          )
          .addTo(group);
      });
    }

    if (layers.hubs) {
      hubs.forEach((h) => {
        L.circleMarker([h.lat, h.lng], {
          radius: 8,
          color: "#0f172a",
          fillColor: "#334155",
          fillOpacity: 0.85,
          weight: 2,
        })
          .bindPopup(
            `<div style="font-size:12px"><strong>Hub: ${h.name}</strong><br/>${h.type} • Occupancy: ${h.occupancyPct}%<br/>Vacant Units: ${h.vacantUnits}</div>`
          )
          .addTo(group);
      });
    }
  }, [projects, properties, branches, neighborhoods, hubs, layers]);

  return <div ref={containerRef} className="h-[540px] w-full rounded-xl z-10" />;
}
