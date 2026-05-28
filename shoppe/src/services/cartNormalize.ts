import type { ICart, ICartItem, IProductVariant } from '../untils/types/TypeCartItem';

export type NormalizedCartState = {
  data: ICart[];
  totalRecord: number;
  totalCartItem: number;
};

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key] as T;
  }
  return undefined;
}

function mapProductVariant(raw: Record<string, unknown>): IProductVariant | null {
  const nested = raw.productVariant ?? raw.ProductVariant;
  if (nested && typeof nested === 'object') {
    const v = nested as Record<string, unknown>;
    return {
      id: String(pick(v, 'id', 'Id') ?? ''),
      variantName: String(pick(v, 'variantName', 'VariantName') ?? 'Phân loại'),
      variantValue: String(pick(v, 'variantValue', 'VariantValue') ?? ''),
      imageUrl: pick<string>(v, 'imageUrl', 'ImageUrl', 'variantImage', 'VariantImage'),
      price: Number(pick(v, 'price', 'Price') ?? 0),
      stockQuantity: Number(pick(v, 'stockQuantity', 'StockQuantity') ?? 0),
    };
  }

  const variantId = pick<string>(raw, 'productVariantId', 'ProductVariantId');
  const variantName = pick<string>(raw, 'variantName', 'VariantName');
  if (!variantId && !variantName) return null;

  return {
    id: String(variantId ?? ''),
    variantName: String(variantName ?? 'Phân loại'),
    variantValue: String(pick(raw, 'variantValue', 'VariantValue') ?? ''),
    imageUrl: pick(raw, 'variantImage', 'VariantImage'),
    price: Number(pick(raw, 'price', 'Price') ?? 0),
    stockQuantity: Number(pick(raw, 'stockQuantity', 'StockQuantity') ?? 0),
  };
}

export function mapCartItemDetail(raw: Record<string, unknown>): ICartItem {
  const productVariant = mapProductVariant(raw);
  const price = Number(pick(raw, 'price', 'Price') ?? productVariant?.price ?? 0);

  return {
    id: String(pick(raw, 'id', 'Id') ?? ''),
    productId: String(pick(raw, 'productId', 'ProductId') ?? ''),
    productName: String(pick(raw, 'productName', 'ProductName') ?? ''),
    thumbnail:
      pick<string>(raw, 'thumbnail', 'Thumbnail') ??
      productVariant?.imageUrl ??
      pick(raw, 'variantImage', 'VariantImage'),
    productVariantId: pick(raw, 'productVariantId', 'ProductVariantId') ?? null,
    productVariant,
    quantity: Number(pick(raw, 'quantity', 'Quantity') ?? 1),
    price,
    stockQuantity: Number(pick(raw, 'stockQuantity', 'StockQuantity') ?? 99),
    sellerId: String(pick(raw, 'sellerId', 'SellerId') ?? ''),
    fullName: String(pick(raw, 'fullName', 'FullName', 'sellerName', 'SellerName') ?? 'Cửa hàng'),
    isSelected: Boolean(pick(raw, 'isSelected', 'IsSelected')),
  };
}

export function mapSellerCartGroup(raw: Record<string, unknown>): ICart {
  const itemsRaw = pick<unknown[]>(raw, 'items', 'Items') ?? [];
  const items = itemsRaw.map((item) => mapCartItemDetail(item as Record<string, unknown>));

  return {
    sellerId: String(pick(raw, 'sellerId', 'SellerId') ?? ''),
    sellerName: String(
      pick(raw, 'sellerName', 'SellerName', 'fullName', 'FullName') ?? 'Cửa hàng'
    ),
    items,
  };
}

export function normalizeCartApiResponse(res: unknown): NormalizedCartState {
  const payload = (res ?? {}) as Record<string, unknown>;
  const dataRaw = pick<unknown[]>(payload, 'data', 'Data') ?? [];
  const data = dataRaw.map((group) => mapSellerCartGroup(group as Record<string, unknown>));

  const totalRecord = Number(pick(payload, 'totalRecord', 'TotalRecord') ?? data.length);
  const totalCartItem = Number(
    pick(payload, 'totalCartItem', 'TotalCartItem') ??
      data.reduce((sum, seller) => sum + seller.items.reduce((s, i) => s + i.quantity, 0), 0)
  );

  return { data, totalRecord, totalCartItem };
}

export function getSelectedCartItems(data: ICart[]): ICartItem[] {
  return data.flatMap((seller) => seller.items.filter((item) => item.isSelected));
}

export function getCartLineUnitPrice(item: ICartItem): number {
  return item.productVariant?.price ?? item.price;
}

export function toCheckoutOrderItem(item: ICartItem) {
  const price = getCartLineUnitPrice(item);
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    price,
    quantity: item.quantity,
    thumbnail: item.thumbnail || item.productVariant?.imageUrl || '',
    productVariantId: item.productVariantId ?? null,
    variantName: item.productVariant?.variantName ?? null,
    variantValue: item.productVariant?.variantValue ?? null,
  };
}
