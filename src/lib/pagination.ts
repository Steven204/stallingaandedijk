export const PAGE_SIZE = 25;

export function getPaginationParams(searchParams: { page?: string }) {
  const parsed = Number(searchParams.page ?? "1");
  const page = Math.max(1, Number.isNaN(parsed) ? 1 : parsed);
  return {
    page,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
}
