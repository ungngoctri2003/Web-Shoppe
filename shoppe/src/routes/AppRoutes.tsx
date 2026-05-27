// AppRoutes.tsx
import { Navigate, useRoutes } from 'react-router-dom';
import RouteMap from './RouteMap';

import { getStateApp } from '../features/slices/app.slice';
import { useSelector } from 'react-redux';
import { AuthMainRoutes } from './AuthRoutes';
import UserRoutes from './UserRoutes';
import { memo } from 'react';
import PageUnauthorized from '../pages/unauthorized/PageUnauthorized';
import PageNotFound from '../pages/unauthorized/PageNotFound';

const AppRoutes = () => {
  const stateApp = useSelector(getStateApp);

  const coreRoutes = stateApp?.role_id
    ? [...UserRoutes, ...(RouteMap[stateApp?.role_id] || []), ...AuthMainRoutes]
    : [...AuthMainRoutes, ...UserRoutes];

  const routes = [
    { path: '/', element: <Navigate to="/user" replace /> },
    { path: '/unauthorized', element: <PageUnauthorized /> },
    ...coreRoutes,
    { path: '*', element: <PageNotFound /> },
  ];

  return useRoutes(routes);
};

export default memo(AppRoutes);
