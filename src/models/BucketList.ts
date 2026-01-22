import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBucketList extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  itemCount: number;
  completedCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BucketListSchema = new Schema<IBucketList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Bucket list name is required"],
      trim: true,
      maxlength: [100, "List name cannot exceed 100 characters"],
    },
    itemCount: {
      type: Number,
      default: 0,
      min: [0, "Item count cannot be negative"],
    },
    completedCount: {
      type: Number,
      default: 0,
      min: [0, "Completed count cannot be negative"],
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying user's lists
BucketListSchema.index({ userId: 1, createdAt: -1 });

// Index for finding inactive lists
BucketListSchema.index({ userId: 1, lastActivityAt: -1 });

// Virtual for completion percentage
BucketListSchema.virtual("completionPercentage").get(function (this: IBucketList) {
  if (this.itemCount === 0) return 0;
  return Math.round((this.completedCount / this.itemCount) * 100);
});

// Ensure virtuals are included in JSON
BucketListSchema.set("toJSON", { virtuals: true });
BucketListSchema.set("toObject", { virtuals: true });

const BucketList: Model<IBucketList> =
  mongoose.models.BucketList || mongoose.model<IBucketList>("BucketList", BucketListSchema);

export default BucketList;
