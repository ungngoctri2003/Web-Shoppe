import type { ICart, ICartItem, IProductVariant } from '../untils/types/TypeCartItem';
import type { AppDispatch } from '../features/store';
import { setCart } from '../features/slices/cart.slice';

const GUEST_CART_KEY = 't2shop_guest_cart';

export type GuestCartAddInput = {
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  thumbnail?: string;
  productVariantId?: string | null;
  productVariant?: IProductVariant | null;
  quantity: number;
  price: number;
  stockQuantity: number;
};

function readRawItems(): ICartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRawItems(items: ICartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function makeItemId(productId: string, productVariantId?: string | null) {
  return `guest_${productId}_${productVariantId ?? 'default'}`;
}

export function groupGuestItemsBySeller(items: ICartItem[]): ICart[] {
  const map = new Map<string, ICart>();

  for (const item of items) {
    const sellerId = item.sellerId || 'unknown';
    if (!map.has(sellerId)) {
      map.set(sellerId, {
        sellerId,
        sellerName: item.fullName || 'Cửa hàng',
        items: [],
      });
    }
    map.get(sellerId)!.items.push(item);
  }

  return Array.from(map.values());
}

export function buildCartStateFromGuest() {
  const items = readRawItems();
  const totalCartItem = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    data: groupGuestItemsBySeller(items),
    totalRecord: items.length,
    totalCartItem,
  };
}

export function syncGuestCartToRedux(dispatch: AppDispatch) {
  dispatch(setCart(buildCartStateFromGuest()));
}

export function addGuestCartItem(input: GuestCartAddInput): ICartItem[] {
  const items = readRawItems();
  const id = makeItemId(input.productId, input.productVariantId);
  const existing = items.find((i) => i.id === id);
  const nextQty = (existing?.quantity ?? 0) + input.quantity;
  const quantity = Math.min(nextQty, input.stockQuantity);

  const nextItem: ICartItem = {
    id,
    productId: input.productId,
    productName: input.productName,
    thumbnail: input.thumbnail,
    productVariantId: input.productVariantId ?? null,
    productVariant: input.productVariant ?? null,
    quantity,
    price: input.price,
    stockQuantity: input.stockQuantity,
    sellerId: input.sellerId,
    fullName: input.sellerName,
    isSelected: false,
  };

  const nextItems = existing
    ? items.map((i) => (i.id === id ? nextItem : i))
    : [...items, nextItem];

  writeRawItems(nextItems);
  return nextItems;
}

export function updateGuestCartQuantity(
  productId: string,
  productVariantId: string | null,
  quantity: number
) {
  const id = makeItemId(productId, productVariantId);
  const items = readRawItems()
    .map((item) => {
      if (item.id !== id) return item;
      const qty = Math.max(1, Math.min(quantity, item.stockQuantity));
      return { ...item, quantity: qty };
    });
  writeRawItems(items);
  return items;
}

export function removeGuestCartItem(itemId: string) {
  const items = readRawItems().filter((i) => i.id !== itemId);
  writeRawItems(items);
  return items;
}

export function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function getGuestCartItems() {
  return readRawItems();
}

export function guestItemToApiPayload(item: ICartItem) {
  const variant = item.productVariant;
  return {
    productId: item.productId,
    productName: item.productName,
    sellerName: item.fullName,
    thumbnail: item.thumbnail,
    productVariantId: item.productVariantId ?? null,
    variantName: variant ? `${variant.variantName}: ${variant.variantValue}` : null,
    variantPrice: variant?.price ?? item.price,
    variantImage: variant?.imageUrl ?? null,
    stockQuantity: item.stockQuantity,
    price: variant?.price ?? item.price,
    quantity: item.quantity,
  };
}

export function buildGuestCartItemFromProduct(
  product: any,
  variant: any | null,
  quantity: number
): GuestCartAddInput {
  const price = variant?.price ?? product.price;
  const stockQuantity = variant?.stockQuantity ?? product.stockQuantity ?? 1;

  let productVariant: IProductVariant | null = null;
  if (variant) {
    const variantLabel = [variant.color, variant.size].filter(Boolean).join(' - ');
    productVariant = {
      id: variant.id,
      variantName: 'Phân loại',
      variantValue: variantLabel || variant.variantName || '',
      imageUrl: variant.imageUrl,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
    };
  }

  return {
    productId: product.id,
    productName: product.productName,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    thumbnail: variant?.imageUrl || product.thumbnail,
    productVariantId: variant?.id ?? null,
    productVariant,
    quantity,
    price,
    stockQuantity,
  };
}
