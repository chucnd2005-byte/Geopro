export type CategoryType = 'GNSS_RTK' | 'TOTAL_STATION' | 'OPTICAL_LEVEL' | 'THEODOLITE' | 'ACCESSORY';

export interface TechnicalSpecs {
  categoryType: CategoryType;
  // GNSS RTK
  channels?: number;
  constellations?: string;
  horizontalAccuracy?: string;
  verticalAccuracy?: string;
  tiltCompensation?: string;
  uhfPower?: string;
  batteryLifeHours?: number;
  weightKg?: number;
  ingressProtection?: string;
  
  // Total Station
  angularAccuracy?: string;
  reflectorlessRange?: string;
  prismRange?: string;
  edmSpeed?: string;

  // Optical Level
  magnification?: string;
  stdDevPerKm?: string;

  // Additional detail key-values
  extraDetails?: Record<string, string>;
}

export interface TechnicalDownload {
  id: string;
  title: string;
  docType: 'CATALOG_PDF' | 'CALIBRATION_CERT' | 'USER_MANUAL' | 'FIRMWARE';
  fileUrl: string;
  fileSize: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  priceAdjustment: number;
  stock: number;
  bundleIncludes?: string[];
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    country: string;
    officialDealer: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  basePrice: number;
  salePrice?: number;
  stock: number;
  condition: 'NEW_100' | 'REFURBISHED_99';
  origin: string;
  warrantyMonths: number;
  isQuoteOnly: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  mainImage: string;
  gallery: string[];
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  standardPackage: string[];
  specs: TechnicalSpecs;
  variants?: ProductVariant[];
  downloads?: TechnicalDownload[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface QuoteRequestInput {
  companyName: string;
  taxId?: string;
  contactName: string;
  phone: string;
  email: string;
  projectLocation?: string;
  projectScale?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    targetPrice?: number;
  }[];
}

export interface FilterState {
  searchQuery: string;
  categorySlug: string;
  brandSlug: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  minChannels?: number;
  angularAccuracy?: string;
  quoteOnlyOnly?: boolean;
  inStockOnly?: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'accuracy';
}
