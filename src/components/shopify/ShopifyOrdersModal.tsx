'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  X,
  ShoppingBag,
  Package,
  Truck,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { SHOPIFY_PRODUCTS, SHOPIFY_STORE_URL } from '../../data/shopifyData';
import { soundFX } from '../audio/soundEffects';

export const ShopifyOrdersModal: React.FC = () => {
  const isShopifyOrdersModalOpen = useOfficeStore((s) => s.isShopifyOrdersModalOpen);
  const setShopifyOrdersModalOpen = useOfficeStore((s) => s.setShopifyOrdersModalOpen);
  const shopifyOrders = useOfficeStore((s) => s.shopifyOrders);
  const shopifyMetrics = useOfficeStore((s) => s.shopifyMetrics);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);

  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');

  if (!isShopifyOrdersModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-emerald-500/40 bg-[#070b16] shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0a0f1d] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-wide text-white font-mono">
                  ALFERNEX // PANEL DE VENTAS REALES
                </h3>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                  DROPI PERÚ ID: 132455
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Datos reales sincronizados con tu tienda <span className="text-emerald-400 font-mono">8bhsfq-gz.myshopify.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={SHOPIFY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-400 hover:bg-sky-500/20 transition"
            >
              <span>Visitar Tienda en Vivo</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={() => {
                setShopifyOrdersModalOpen(false);
                soundFX.playClick(soundEnabled);
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Real KPI Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/80 p-4 border-b border-slate-800 font-mono text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-[10px] uppercase text-slate-400 block">Facturación Real</span>
            <span className="text-lg font-bold text-emerald-400">
              S/. {shopifyMetrics.gross_revenue_pen.toFixed(2)} PEN
            </span>
            <span className="text-[10px] text-slate-500 block">Ingresos verificados</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-[10px] uppercase text-slate-400 block">Ganancia Neta Real</span>
            <span className="text-lg font-bold text-sky-400">
              S/. {shopifyMetrics.net_profit_pen.toFixed(2)} PEN
            </span>
            <span className="text-[10px] text-slate-500 block">Descontando Dropi & flete</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <span className="text-[10px] uppercase text-slate-400 block">Órdenes Reales</span>
            <span className="text-lg font-bold text-amber-300">
              {shopifyMetrics.total_orders}
            </span>
            <span className="text-[10px] text-slate-500 block">Dropi COD</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col justify-between">
            <span className="text-[10px] uppercase text-slate-400 block">Estado de Tienda</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SIN CONTRASEÑA</span>
            </div>
            <span className="text-[10px] text-slate-500">Lista para tráfico TikTok</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold font-mono transition border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>ÓRDENES REALES RECIBIDAS ({shopifyOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 text-xs font-bold font-mono transition border-b-2 flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>CATÁLOGO REAL SHOPIFY ({SHOPIFY_PRODUCTS.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {activeTab === 'orders' && (
            <div>
              {shopifyOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-950/60">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-white font-mono mb-2">
                    0 ÓRDENES REALES REGISTRADAS AÚN
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                    Tu tienda <strong className="text-emerald-400">8bhsfq-gz.myshopify.com</strong> ya está abierta al público y lista para recibir clientes. Las ventas reales comenzarán a registrarse aquí en cuanto tu campaña en TikTok Ads comience a enviar compradores o realices un pedido de prueba.
                  </p>
                  <a
                    href={SHOPIFY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 transition"
                  >
                    <span>Realizar Pedido de Prueba en Tienda Real</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {shopifyOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700 font-mono text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">{ord.id}</span>
                          <span className="text-slate-400">• {ord.name}</span>
                          <span className="text-slate-500">({ord.phone})</span>
                        </div>
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          {ord.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-500 block">Producto:</span>
                          <span className="text-white font-semibold">{ord.bundle}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Destino:</span>
                          <span>{ord.address}, {ord.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Total a Cobrar COD:</span>
                          <span className="text-emerald-400 font-bold">S/. {ord.final_price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Mostrando los productos activos en tu tienda Shopify:
                </span>
                <span className="text-xs font-mono text-sky-400">
                  Sincronizado con Dropi Perú
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SHOPIFY_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 font-mono text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h5 className="font-bold text-white text-xs leading-snug">{prod.name}</h5>
                        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9.5px] font-bold text-sky-300 border border-sky-400/30">
                          {prod.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mb-3">
                        ID Shopify: <span className="text-slate-300">{prod.id}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Precio Venta</span>
                        <span className="font-bold text-white">S/. {prod.sale_price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Costo Dropi</span>
                        <span className="font-semibold text-slate-300">S/. {prod.cogs_dropi.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Margen Neto</span>
                        <span className="font-bold text-emerald-400">S/. {prod.margin_pen.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
