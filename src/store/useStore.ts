import { create } from 'zustand';
import { Product, ProductVariant, CartItem } from '@/lib/types';

interface AppStore {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;

  // B2B Quote
  quoteItems: { product: Product; quantity: number }[];
  addToQuote: (product: Product, quantity?: number) => void;
  removeFromQuote: (productId: string) => void;
  clearQuote: () => void;
  isQuoteModalOpen: boolean;
  setQuoteModalOpen: (open: boolean) => void;
  activeQuoteProduct: Product | null;
  openQuoteForProduct: (product: Product) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Cart
  cart: [],
  isCartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
  addToCart: (product, quantity = 1, variant) => {
    const current = get().cart;
    const existingIndex = current.findIndex(
      (item) => item.product.id === product.id && item.variant?.id === variant?.id
    );

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex].quantity += quantity;
      set({ cart: updated, isCartDrawerOpen: true });
    } else {
      set({ cart: [...current, { product, quantity, variant }], isCartDrawerOpen: true });
    }
    get().showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  },
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.product.id !== productId) });
    get().showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ cart: [] }),

  // Compare (max 4 products)
  compareList: [],
  isCompareModalOpen: false,
  setCompareModalOpen: (open) => set({ isCompareModalOpen: open }),
  addToCompare: (product) => {
    const current = get().compareList;
    if (current.some((p) => p.id === product.id)) {
      set({ compareList: current.filter((p) => p.id !== product.id) });
      get().showToast(`Đã bỏ "${product.name}" khỏi danh sách so sánh`, 'info');
      return false;
    }
    if (current.length >= 4) {
      get().showToast('Tối đa so sánh 4 sản phẩm cùng lúc. Vui lòng bỏ bớt thiết bị.', 'warning');
      return false;
    }
    set({ compareList: [...current, product] });
    get().showToast(`Đã thêm "${product.name}" vào bảng so sánh`, 'success');
    return true;
  },
  removeFromCompare: (productId) => {
    set({ compareList: get().compareList.filter((p) => p.id !== productId) });
  },
  clearCompare: () => set({ compareList: [] }),

  // B2B Quote
  quoteItems: [],
  isQuoteModalOpen: false,
  activeQuoteProduct: null,
  setQuoteModalOpen: (open) => set({ isQuoteModalOpen: open }),
  openQuoteForProduct: (product) => {
    get().addToQuote(product, 1);
    set({ activeQuoteProduct: product, isQuoteModalOpen: true });
  },
  addToQuote: (product, quantity = 1) => {
    const current = get().quoteItems;
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        quoteItems: current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        ),
      });
    } else {
      set({ quoteItems: [...current, { product, quantity }] });
    }
  },
  removeFromQuote: (productId) => {
    set({ quoteItems: get().quoteItems.filter((i) => i.product.id !== productId) });
  },
  clearQuote: () => set({ quoteItems: [] }),

  // Toast
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      if (get().toast?.message === message) {
        set({ toast: null });
      }
    }, 4000);
  },
}));
