import { z } from "zod";

export const CROP_STATUSES = [
  "GROWING",
  "HARVESTED",
  "FAILED",
] as const;

const optionalTrimmedString = (
  maxLength: number
) =>
  z.preprocess(
    (value) =>
      value === "" ? undefined : value,
    z.string().trim().max(maxLength).optional()
  );

export const createCropSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Crop name is required")
      .min(
        2,
        "Crop name must be at least 2 characters"
      )
      .max(
        100,
        "Crop name cannot exceed 100 characters"
      ),

    variety: optionalTrimmedString(100),

    plantingDate: z
      .string()
      .min(
        1,
        "Planting date is required"
      ),

    expectedHarvestDate: z
      .string()
      .optional(),

    notes: optionalTrimmedString(500),

    status: z
      .enum(CROP_STATUSES)
      .optional(),
  })
  .refine(
    (data) => {
      if (
        !data.expectedHarvestDate
      ) {
        return true;
      }

      return (
        new Date(
          data.expectedHarvestDate
        ) >=
        new Date(
          data.plantingDate
        )
      );
    },
    {
      message:
        "Harvest date cannot be before planting date",
      path: [
        "expectedHarvestDate",
      ],
    }
  );

export const updateCropSchema =
  createCropSchema.partial();

export type CreateCropFormValues =
  z.input<typeof createCropSchema>;

export type CreateCropPayload =
  z.output<typeof createCropSchema>;

export type UpdateCropFormValues =
  z.input<typeof updateCropSchema>;