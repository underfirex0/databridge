"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/companies": "Entreprises",
  "/alerts": "Alertes",
  "/merges": "Fusions IA",
  "/import": "Importer des données",
  "/settings": "Paramètres",
};

export default function Header() {
  const pathname = usePathname();

  const title =
    Object.entries(titles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "DataBridge";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center 
                       justify-between px-6 flex-shrink-0">
      {/* Title */}
      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            className="input-base pl-8 pr-4 py-1.5 text-xs w-52 bg-gray-50"
          />
        </div>

        {/* Alerts bell */}
        <button className="relative btn-ghost p-2">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 
                           rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center 
                        justify-center text-white text-xs font-semibold cursor-pointer">
          AT
        </div>
      </div>
    </header>
  );
}
