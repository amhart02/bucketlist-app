import { Types } from "mongoose";

// Database Entity Types
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date;
  settings: {
    activityRemindersEnabled: boolean;
  };
}

export interface IBucketList {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  createdAt: Date;
  lastActivityAt: Date;
  itemCount: number;
  completedCount: number;
}

export interface IBucketListItem {
  _id: Types.ObjectId;
  bucketListId: Types.ObjectId;
  text: string;
  isCompleted: boolean;
  order: number;
  sourceLibraryIdeaId?: Types.ObjectId;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface ILibraryIdea {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  categoryId: Types.ObjectId;
  usageCount: number;
  tags?: string[];
  createdAt: Date;
}

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  iconUrl?: string;
  order: number;
  createdAt: Date;
}

// API Response Types
export interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

export interface BucketListSummary {
  id: string;
  name: string;
  itemCount: number;
  completedCount: number;
  completionPercentage: number;
  lastActivityAt: string;
  createdAt: string;
}

export interface BucketListResponse {
  id: string;
  userId: string;
  name: string;
  itemCount: number;
  completedCount: number;
  completionPercentage: number;
  lastActivityAt: string;
  createdAt: string;
}

export interface BucketListDetailResponse extends BucketListResponse {
  items: BucketListItemResponse[];
}

export interface BucketListItemResponse {
  id: string;
  bucketListId: string;
  text: string;
  isCompleted: boolean;
  order: number;
  sourceLibraryIdeaId?: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface LibraryIdeaResponse {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  usageCount: number;
  tags?: string[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  order: number;
}

export interface UserSettingsResponse {
  activityRemindersEnabled: boolean;
}

export interface PaginationResponse {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// Utility Types
export type CompletionPercentage = number; // 0-100
