interface BucketList {
  _id: string;
  name: string;
  lastActivityAt: string;
  itemCount: number;
}

/**
 * Find lists that haven't been updated in the last 14 days
 * @param lists Array of bucket lists
 * @param daysThreshold Number of days to consider inactive (default: 14)
 * @returns Array of inactive lists, sorted by lastActivityAt (oldest first)
 */
export function findInactiveLists(
  lists: BucketList[],
  daysThreshold: number = 14
): BucketList[] {
  const now = new Date();
  const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;

  return lists
    .filter((list) => {
      // Only consider lists with items
      if (list.itemCount === 0) return false;

      const lastActivity = new Date(list.lastActivityAt);
      const timeSinceActivity = now.getTime() - lastActivity.getTime();

      return timeSinceActivity > thresholdMs;
    })
    .sort((a, b) => {
      // Sort by oldest activity first
      return new Date(a.lastActivityAt).getTime() - new Date(b.lastActivityAt).getTime();
    });
}

/**
 * Get the number of days since last activity
 * @param lastActivityAt ISO date string
 * @returns Number of days since last activity
 */
export function getDaysSinceActivity(lastActivityAt: string): number {
  const now = new Date();
  const lastActivity = new Date(lastActivityAt);
  const diffMs = now.getTime() - lastActivity.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

/**
 * Format the days since activity into a human-readable string
 * @param days Number of days
 * @returns Formatted string like "2 weeks ago" or "3 days ago"
 */
export function formatDaysSince(days: number): string {
  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
}
