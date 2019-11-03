const PORT = 8080;
const HOST = 'localhost';
const API_BASE_ROUTE = `${window.location.protocol}//${HOST}:${PORT}/api/`;

export const getApiRouteUrl = (route: string, params: string[]): string =>
  `${API_BASE_ROUTE}${route}${params.join('/')}`;
