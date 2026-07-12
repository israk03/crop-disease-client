import { z } from "zod";

export const SOIL_TYPES = [
  "CLAY",
  "SANDY",
  "LOAMY",
  "SILTY",
  "PEATY",
  "CHALKY",
  "OTHER",
] as const;

const coordinateField = (min: number, max: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(min).max(max).optional()
  );

export const createFarmSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Farm name must be at least 2 characters")
      .max(100, "Farm name cannot exceed 100 characters"),

    size: z.coerce
      .number()
      .min(0.01, "Farm size must be greater than 0"),

    soilType: z.enum(SOIL_TYPES),

    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(255, "Address cannot exceed 255 characters"),

    region: z
      .string()
      .trim()
      .min(2, "Region must be at least 2 characters")
      .max(100, "Region cannot exceed 100 characters"),

    longitude: coordinateField(-180, 180),
    latitude:  coordinateField(-90, 90),
  })
  .refine(
    (data) => {
      const hasLat = data.latitude !== undefined;
      const hasLng = data.longitude !== undefined;
      return hasLat === hasLng;
    },
    {
      message: "Latitude and longitude must be provided together",
      path: ["latitude"],
    }
  );

export const updateFarmSchema = createFarmSchema.partial();

export type CreateFarmFormValues = z.input<typeof createFarmSchema>;
export type FarmFormValues        = z.input<typeof createFarmSchema>;
export type UpdateFarmFormValues  = z.input<typeof updateFarmSchema>;

// Output types — use these for the API payload (after Zod transforms)
export type CreateFarmPayload = z.output<typeof createFarmSchema>;
export type UpdateFarmPayload = z.output<typeof updateFarmSchema>;