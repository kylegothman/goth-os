export const assetPath = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
