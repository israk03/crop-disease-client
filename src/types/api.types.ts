// ─────────────────────────────────────────────────────────────────────────────
// Shared API Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  searchTerm?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─────────────────────────────────────────────────────────────────────────────
// User & Auth
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole =
  | "FARMER"
  | "EXPERT"
  | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "BLOCKED"
  | "PENDING";

export interface User {
  _id: string;
  name: string;
  email: string;

  phone?: string;
  avatar?: string;
  location?: string;

  role: UserRole;
  status: UserStatus;

  isVerified: boolean;

  specializations?: string[];
  bio?: string;
  experience?: number;
  rating?: number;
  consultationCount?: number;

  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Detection
// ─────────────────────────────────────────────────────────────────────────────

export type DetectionStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type SeverityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface AIResult {
  diseaseName: string;

  confidenceScore: number;

  severityLevel: SeverityLevel;

  affectedParts: string[];

  description: string;

  causes: string[];

  organicTreatment: string[];

  chemicalTreatment: string[];

  preventiveMeasures: string[];

  aiSummary: string;

  isHealthy: boolean;
}

export interface Detection {
  _id: string;

  owner: string;

  cropType: string;

  imageUrl: string;

  status: DetectionStatus;

  aiResult?: AIResult;

  errorMessage?: string;

  isShared: boolean;

  farm?: string;

  crop?: string;

  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Farm & Crop
// ─────────────────────────────────────────────────────────────────────────────

export type SoilType =
  | "CLAY"
  | "SANDY"
  | "LOAMY"
  | "SILTY"
  | "PEATY"
  | "CHALKY"
  | "OTHER";

export type CropStatus =
  | "GROWING"
  | "HARVESTED"
  | "FAILED";

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface Farm {
  _id: string;

  owner: string;

  name: string;

  size: number;

  soilType: SoilType;

  address: string;

  region: string;

  location?: GeoLocation;

  isActive: boolean;

  createdAt: string;
}

export interface Crop {
  _id: string;

  farm: string;

  owner: string;

  name: string;

  variety?: string;

  plantingDate: string;

  expectedHarvestDate?: string;

  status: CropStatus;

  notes?: string;

  area?: number;

  expectedYield?: number;

  actualYield?: number;

  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Community / Forum
// ─────────────────────────────────────────────────────────────────────────────

export interface MediaItem {
  type: "IMAGE" | "VIDEO";
  url: string;
}

export interface Post {
  _id: string;

  author: Pick<
    User,
    "_id" | "name" | "avatar" | "role"
  >;

  title: string;

  description: string;

  media: MediaItem[];

  tags: string[];

  cropType?: string;

  linkedDetection?: string;

  upvoteCount: number;

  commentCount: number;

  trendingScore: number;

  isActive: boolean;

  hasUpvoted?: boolean;

  createdAt: string;
}

export interface Comment {
  _id: string;

  post: string;

  author: Pick<
    User,
    | "_id"
    | "name"
    | "avatar"
    | "role"
    | "specializations"
  >;

  parentComment?: string;

  content: string;

  upvoteCount: number;

  isExpertAnswer: boolean;

  isAcceptedAnswer: boolean;

  isActive: boolean;

  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Consultations
// ─────────────────────────────────────────────────────────────────────────────

export type ConsultationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface Consultation {
  _id: string;

  farmer: Pick<
    User,
    "_id" | "name" | "avatar" | "location"
  >;

  expert: Pick<
    User,
    | "_id"
    | "name"
    | "avatar"
    | "specializations"
    | "rating"
  >;

  status: ConsultationStatus;

  problemDescription: string;

  cropType: string;

  linkedDetection?: string;

  scheduledTime?: string;

  rating?: number;

  review?: string;

  acceptedAt?: string;

  completedAt?: string;

  createdAt: string;
}

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "FILE"
  | "SYSTEM";

export interface Message {
  _id: string;

  consultation: string;

  sender: Pick<
    User,
    "_id" | "name" | "avatar" | "role"
  >;

  content: string;

  messageType: MessageType;

  imageUrl?: string;

  fileUrl?: string;

  isRead: boolean;

  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "DETECTION_COMPLETED"
  | "DETECTION_FAILED"
  | "CONSULTATION_REQUEST"
  | "CONSULTATION_ACCEPTED"
  | "CONSULTATION_REJECTED"
  | "CONSULTATION_COMPLETED"
  | "NEW_MESSAGE"
  | "POST_UPVOTE"
  | "NEW_COMMENT"
  | "COMMENT_UPVOTE"
  | "EXPERT_APPROVED"
  | "NEW_REVIEW"
  | "DISEASE_ALERT"
  | "ALERT_CREATED";

export interface Notification {
  _id: string;

  recipient: string;

  type: NotificationType;

  title: string;

  message: string;

  isRead: boolean;

  referenceId?: string;

  referenceModel?:
    | "Detection"
    | "Consultation"
    | "Post"
    | "Comment";

  metadata?: Record<string, unknown>;

  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Alerts & Outbreaks
// ─────────────────────────────────────────────────────────────────────────────

export type OutbreakLevel =
  | "WATCH"
  | "WARNING"
  | "CRITICAL";

export interface Alert {
  _id: string;

  diseaseName: string;

  cropType: string;

  region: string;

  outbreakLevel: OutbreakLevel;

  description: string;

  affectedFarmCount: number;

  detectionCount: number;

  isActive: boolean;

  isAutoGenerated: boolean;

  createdBy?: Pick<
    User,
    "_id" | "name"
  >;

  expiresAt: string;

  createdAt: string;
}

export interface Outbreak {
  _id: string;

  diseaseName: string;

  cropType: string;

  region: string;

  level: OutbreakLevel;

  detectionCount: number;

  affectedFarmCount: number;

  latitude: number;

  longitude: number;

  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Weather
// ─────────────────────────────────────────────────────────────────────────────

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherCurrent {
  temperature: number;

  feelsLike: number;

  humidity: number;

  windSpeed: number;

  cloudiness: number;

  rainfall1h?: number;

  conditions: WeatherCondition[];

  sunrise: number;

  sunset: number;

  fetchedAt: string;
}

export interface WeatherForecast {
  date: string;

  minTemp: number;

  maxTemp: number;

  humidity: number;

  rainfall: number;

  icon: string;
}

export interface Advisory {
  type:
    | "IRRIGATION"
    | "DISEASE_RISK"
    | "FERTILIZER"
    | "HARVEST"
    | "PEST_RISK"
    | "GENERAL";

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

  title: string;

  message: string;

  actionRequired: boolean;
}