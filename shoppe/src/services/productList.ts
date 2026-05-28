export type ProductGridRequest = {
  pageInfo: { page: number; pageSize: number };
  keyWord?: string;
  filter?: Record<string, unknown>;
  sorts?: Record<string, unknown>;
};

export type ProductListApiResponse = {
  success?: boolean;
  data?: unknown[];
  totalRecord?: number;
  message?: string;
};

export function filterStorefrontProducts<T extends { isActive?: boolean; sellerStatus?: boolean }>(
  products: T[]
): T[] {
  return products.filter((p) => p.isActive !== false && p.sellerStatus !== false);
}

export function parseProductListResponse(res: ProductListApiResponse | null | undefined): {
  items: any[];
  total: number;
} {
  if (!res?.success || !Array.isArray(res.data)) {
    return { items: [], total: 0 };
  }

  const items = filterStorefrontProducts(res.data as { isActive?: boolean; sellerStatus?: boolean }[]);
  return {
    items,
    total: typeof res.totalRecord === 'number' ? res.totalRecord : items.length,
  };
}

export function buildProductGridBody(
  page: number,
  pageSize: number,
  keyWord = ''
): ProductGridRequest {
  return {
    pageInfo: { page, pageSize },
    keyWord,
    filter: {},
    sorts: {},
  };
}
