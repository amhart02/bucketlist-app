import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBucketListItem extends Document {
  _id: mongoose.Types.ObjectId;
  bucketListId: mongoose.Types.ObjectId;
  text: string;
  isCompleted: boolean;
  order: number;
  sourceLibraryIdeaId?: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BucketListItemSchema = new Schema<IBucketListItem>(
  {
    bucketListId: {
      type: Schema.Types.ObjectId,
      ref: "BucketList",
      required: [true, "Bucket list ID is required"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "Item text is required"],
      trim: true,
      minlength: [1, "Item text cannot be empty"],
      maxlength: [500, "Item text cannot exceed 500 characters"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [0, "Order cannot be negative"],
    },
    sourceLibraryIdeaId: {
      type: Schema.Types.ObjectId,
      ref: "LibraryIdea",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying items in a list, ordered
BucketListItemSchema.index({ bucketListId: 1, order: 1 });

// Index for querying completed vs incomplete items
BucketListItemSchema.index({ bucketListId: 1, isCompleted: 1 });

// Pre-save hook to set completedAt when item is marked complete
BucketListItemSchema.pre("save", function (next) {
  if (this.isModified("isCompleted")) {
    if (this.isCompleted && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.isCompleted) {
      this.completedAt = undefined;
    }
  }
  next();
});

const BucketListItem: Model<IBucketListItem> =
  mongoose.models.BucketListItem || mongoose.model<IBucketListItem>("BucketListItem", BucketListItemSchema);

export default BucketListItem;
