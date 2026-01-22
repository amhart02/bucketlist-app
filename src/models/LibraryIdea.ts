import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILibraryIdea extends Document {
  _id: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  usageCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LibraryIdeaSchema = new Schema<ILibraryIdea>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Usage count cannot be negative"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for category-based queries
LibraryIdeaSchema.index({ categoryId: 1, usageCount: -1 });

// Text index for search functionality
LibraryIdeaSchema.index({ title: "text", description: "text", tags: "text" });

// Index for popular ideas
LibraryIdeaSchema.index({ usageCount: -1 });

const LibraryIdea: Model<ILibraryIdea> =
  mongoose.models.LibraryIdea || mongoose.model<ILibraryIdea>("LibraryIdea", LibraryIdeaSchema);

export default LibraryIdea;
