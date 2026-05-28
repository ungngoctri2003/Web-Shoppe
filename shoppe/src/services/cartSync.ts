import type { AppDispatch } from '../features/store';
import { getUserCartItems, createCartItem } from '../api/cartitem/cartitem.api';
import { setCart } from '../features/slices/cart.slice';
import { ROLE } from '../constants';
import {
  buildCartStateFromGuest,
  clearGuestCart,
  getGuestCartItems,
  guestItemToApiPayload,
  syncGuestCartToRedux,
} from './guestCart';
import { normalizeCartApiResponse } from './cartNormalize';

export function isLoggedInUser(token: string | null, roleId?: string | null) {
  return Boolean(token && roleId === ROLE.USER);
}

export async function fetchServerCart(dispatch: AppDispatch) {
  const body = { pageInfo: { page: 1, pageSize: 50 }, keyWord: '' };
  const res = await getUserCartItems(body);
  dispatch(setCart(normalizeCartApiResponse(res)));
}

export async function mergeGuestCartToServer(dispatch: AppDispatch) {
  const guestItems = getGuestCartItems();
  if (!guestItems.length) {
    await fetchServerCart(dispatch);
    return;
  }

  for (const item of guestItems) {
    try {
      await createCartItem(guestItemToApiPayload(item));
    } catch (err) {
      console.error('Không thể đồng bộ sản phẩm guest cart:', item.productId, err);
    }
  }

  clearGuestCart();
  await fetchServerCart(dispatch);
}

export function loadCartForSession(
  dispatch: AppDispatch,
  token: string | null,
  roleId?: string | null
) {
  if (isLoggedInUser(token, roleId)) {
    return fetchServerCart(dispatch);
  }
  syncGuestCartToRedux(dispatch);
  return Promise.resolve();
}

export { buildCartStateFromGuest, syncGuestCartToRedux };
