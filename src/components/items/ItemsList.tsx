import BucketListItemCard from "./BucketListItemCard";

interface Item {
  _id: string;
  bucketListId: string;
  text: string;
  isCompleted: boolean;
  order: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemsListProps {
  items: Item[];
  onToggle: (itemId: string, isCompleted: boolean) => Promise<void>;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

export default function ItemsList({
  items,
  onToggle,
  onEdit,
  onDelete,
}: ItemsListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <BucketListItemCard
          key={item._id}
          item={item}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
