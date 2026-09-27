'use client';

import React from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  ShoppingBag,
  ExternalLink,
  PackageCheck,
  Truck,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { SHOPIFY_STORE_URL } from '../../data/shopifyData';
import { soundFX } from '../audio/soundEffects';

export const ShopifyWarRoomBar: React.FC = () => {
  const shopifyMetrics = useOfficeStore((s) => s.shopifyMetrics);
  const setShopifyOrdersModalOpen = useOfficeStore((s) => s.setShopifyOrdersModalOpen);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 bg-[#050812]/95 px-4 py-2 backdrop-blur-md">
      {/* Left: Store identity & Direct Link */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
          <ShoppingBag className="h-4 w-4" />
          <span className="font-mono text-xs font-black tracking-wider">
            VENTAS REALES SHOPIFY
          </span>
        </div>

        <a
          href={SHOPIFY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir tienda virtual ALFERNEX en vivo"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-850 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-sky-400 hover:text-sky-300 transition"
        >
          <span className="font-mono text-[11px]">8bhsfq-gz.myshopify.com</span>
          <ExternalLink className="h-3 w-3 text-sky-400" />
        </a>

        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SIN CLAVE • PÚBLICA</span>
        </div>
      </div>

      {/* Center: Real Live Sales Telemetry in Peruvian Soles (PEN) */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
          <span className="text-[10px] uppercase text-slate-400">Ventas Reales:</span>
          <span className="font-black text-emerald-400 text-sm">
            S/. {shopifyMetrics.gross_revenue_pen.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
          <span className="text-[10px] uppercase text-slate-400">Ganancia Neta:</span>
          <span className="font-black text-sky-400 text-sm">
            S/. {shopifyMetrics.net_profit_pen.toFixed(2)}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-800 pr-3">
          <PackageCheck className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[10px] uppercase text-slate-400">Órdenes Reales:</span>
          <span className="font-bold text-amber-300">
            {shopifyMetrics.total_orders}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Truck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Dropi Perú: ID 132455</span>
        </div>
      </div>

      {/* Right: Real store actions */}
      <div className="flex items-center gap-2">
        <a
          href={SHOPIFY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 active:scale-95 transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>PROBAR COMPRA EN TIENDA</span>
        </a>

        <button
          onClick={() => {
            setShopifyOrdersModalOpen(true);
            soundFX.playClick(soundEnabled);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-slate-500 hover:text-white transition"
        >
          <span>📦 CATÁLOGO & ÓRDENES ({shopifyMetrics.total_orders})</span>
        </button>
      </div>
    </div>
  );
};
