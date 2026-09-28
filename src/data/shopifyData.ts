import { ShopifyMetrics, ShopifyOrder, ShopifyProduct } from '../types/office';

export const SHOPIFY_STORE_URL = 'https://8bhsfq-gz.myshopify.com';

// REAL LIVE METRICS: Sincronizados con el estado real de 8bhsfq-gz.myshopify.com y Dropi Perú ID: 132455 (Sin ventas registradas aún)
export const INITIAL_SHOPIFY_METRICS: ShopifyMetrics = {
  total_orders: 0,
  confirmed_orders: 0,
  dispatched_orders: 0,
  gross_revenue_pen: 0.0,
  net_profit_pen: 0.0,
  upsell_taken_count: 0
};

// REAL CATALOG EXTRACTED DIRECTLY FROM https://8bhsfq-gz.myshopify.com/products.json
export const SHOPIFY_PRODUCTS: ShopifyProduct[] = [
  {
    id: '8964561829911',
    name: 'Magnetic 3-in-1 Wireless Charger Station',
    cogs_dropi: 35.98,
    sale_price: 89.95,
    shipping_avg: 14.0,
    margin_pen: 39.97,
    margin_pct: 44.4,
    status: 'HERO_GANADOR'
  },
  {
    id: '8964561797143',
    name: 'JAKCOM Smart Lifestyle Ring',
    cogs_dropi: 31.98,
    sale_price: 79.95,
    shipping_avg: 14.0,
    margin_pen: 33.97,
    margin_pct: 42.5,
    status: 'HERO_GANADOR'
  },
  {
    id: '8964561764375',
    name: 'Dual Lens Car Dash Cam',
    cogs_dropi: 27.98,
    sale_price: 69.95,
    shipping_avg: 14.0,
    margin_pen: 27.97,
    margin_pct: 40.0,
    status: 'HERO_GANADOR'
  },
  {
    id: '8964561109015',
    name: 'MagSafe PowerBank Pro 10000mAh',
    cogs_dropi: 28.38,
    sale_price: 70.95,
    shipping_avg: 14.0,
    margin_pen: 28.57,
    margin_pct: 40.3,
    status: 'ESCALANDO'
  },
  {
    id: '8964560912407',
    name: 'Reolink UltraGuard Outdoor WiFi Camera 4K',
    cogs_dropi: 78.38,
    sale_price: 195.95,
    shipping_avg: 14.0,
    margin_pen: 103.57,
    margin_pct: 52.9,
    status: 'HERO_GANADOR'
  },
  {
    id: '8964561371159',
    name: 'Portable Espresso Master - 3-in-1 Coffee Maker',
    cogs_dropi: 40.38,
    sale_price: 100.95,
    shipping_avg: 14.0,
    margin_pen: 46.57,
    margin_pct: 46.1,
    status: 'ESCALANDO'
  },
  {
    id: '8964561666071',
    name: 'Smartwatch for Fitness and Style',
    cogs_dropi: 12.78,
    sale_price: 31.95,
    shipping_avg: 14.0,
    margin_pen: 5.17,
    margin_pct: 16.2,
    status: 'TESTEANDO'
  },
  {
    id: '8964561338391',
    name: 'Boomcard GPS Tracker Ultra-Thin',
    cogs_dropi: 19.98,
    sale_price: 49.95,
    shipping_avg: 14.0,
    margin_pen: 15.97,
    margin_pct: 32.0,
    status: 'ESCALANDO'
  },
  {
    id: '8964561469463',
    name: 'Smart Wireless Doorbell Camera',
    cogs_dropi: 12.38,
    sale_price: 30.95,
    shipping_avg: 14.0,
    margin_pen: 4.57,
    margin_pct: 14.8,
    status: 'TESTEANDO'
  },
  {
    id: '8964561043479',
    name: 'Smart XE Gimbal Stabilizer',
    cogs_dropi: 41.18,
    sale_price: 102.95,
    shipping_avg: 14.0,
    margin_pen: 47.77,
    margin_pct: 46.4,
    status: 'ESCALANDO'
  },
  {
    id: '8964560945175',
    name: '3in1 Wireless Charger Hub Foldable',
    cogs_dropi: 38.38,
    sale_price: 95.95,
    shipping_avg: 14.0,
    margin_pen: 43.57,
    margin_pct: 45.4,
    status: 'HERO_GANADOR'
  },
  {
    id: '8964561633303',
    name: 'Smart Body Composition Scale Digital',
    cogs_dropi: 30.38,
    sale_price: 75.95,
    shipping_avg: 14.0,
    margin_pen: 31.57,
    margin_pct: 41.6,
    status: 'ESCALANDO'
  }
];

// REAL ORDERS QUEUE: Empty initially, filled only by real customer checkout submissions
export const INITIAL_SHOPIFY_ORDERS: ShopifyOrder[] = [];

export const SIMULATION_CUSTOMERS: Array<{ name: string; city: string; phone: string; address: string }> = [];
