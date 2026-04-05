import { prisma } from "@/lib/prisma";

export async function isDateInClosedSeason(date: Date): Promise<{ closed: boolean; seasonName?: string }> {
  const seasons = await prisma.seasonConfig.findMany({
    where: { isClosedForPickup: true },
  });

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  for (const season of seasons) {
    if (isWithinSeason(month, day, season.startMonth, season.startDay, season.endMonth, season.endDay)) {
      return { closed: true, seasonName: season.name };
    }
  }

  return { closed: false };
}

function isWithinSeason(
  month: number,
  day: number,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number
): boolean {
  const current = month * 100 + day;
  const start = startMonth * 100 + startDay;
  const end = endMonth * 100 + endDay;

  if (start <= end) {
    // Same year range (e.g., March 15 to November 15)
    return current >= start && current <= end;
  } else {
    // Crosses year boundary (e.g., November 15 to March 15)
    return current >= start || current <= end;
  }
}

export async function getClosedSeasons() {
  return prisma.seasonConfig.findMany({
    where: { isClosedForPickup: true },
  });
}
