interface BucketList {
  _id: string;
  name: string;
  itemCount: number;
  completedCount: number;
  completionPercentage: number;
  lastActivityAt: string;
  createdAt: string;
}

interface BucketListsGridProps {
  lists: BucketList[];
  onListDeleted: () => void;
}

import BucketListCard from "./BucketListCard";

export default function BucketListsGrid({ lists, onListDeleted }: BucketListsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <BucketListCard key={list._id} list={list} onDeleted={onListDeleted} />
      ))}
    </div>
  );
}
