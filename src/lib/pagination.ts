export const PAGE_SIZE = 25;

export function getPaginationParams(searchParams: { page?: string }) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  return {
    page,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
}
