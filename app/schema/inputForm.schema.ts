/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

// Utility function to create a schema for section weights with dynamic validation
const createSectionWeightsSchema = (preform?: string) => {
  const preformValue = parseFloat(
    preform?.match(/_(\d+(\.\d+)?)$/)?.[1] || "0"
  );

  return z
    .object({
      shoulder: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 6.8 && num <= 7.9);
          },
          {
            message: "Base must be between 6.8 and 7.9",
          }
        ),
      label: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 3.8 && num <= 5.0);
          },
          {
            message: "Label must be between 3.8 and 5.0",
          }
        ),
      grip: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 4.5 && num <= 6.0);
          },
          {
            message: "grip must be between 4.5 and 6.0",
          }
        ),
      base: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 3.0 && num <= 4.8);
          },
          {
            message: "Base must be between 3.0 and 4.8",
          }
        ),
    })
    .refine(
      (data) => {
        const weights = Object.values(data).map((weight) =>
          parseFloat(weight || "0")
        );
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

        return (
          totalWeight >= preformValue - 0.3 && totalWeight <= preformValue + 0.3
        );
      },
      {
        message:
          "The total of section weights must be within +0.3 or -0.3 of selected preform weights.",
      }
    );
};

export const bottleMeasurementSchema = z.object({
  sectionWeights: z
    .object({
      shoulder: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 6.8 && num <= 7.9);
          },
          {
            message: "Base must be between 6.8 and 7.9",
          }
        ),
      label: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 3.8 && num <= 5.0);
          },
          {
            message: "Label must be between 3.8 and 5.0",
          }
        ),
      grip: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 4.5 && num <= 6.0);
          },
          {
            message: "grip must be between 4.5 and 6.0",
          }
        ),
      base: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 3.0 && num <= 4.8);
          },
          {
            message: "Base must be between 3.0 and 4.8",
          }
        ),
    })
    .optional(), // We are validating this separately
  thickness: z
    .object({
      t1: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 0.05 && num <= 0.35);
          },
          {
            message: "T1 must be between 0.05 and 0.35",
          }
        ),
      t2: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 0.22 && num <= 0.29);
          },
          {
            message: "T2 must be between 0.22 and 0.29",
          }
        ),
      t3: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 0.05 && num <= 0.33);
          },
          {
            message: "T3 must be between 0.05 and 0.33",
          }
        ),
      t4: z
        .string()
        .optional()
        .refine(
          (val) => {
            const num = Number(val);
            return !val || (num >= 0.19 && num <= 0.25);
          },
          {
            message: "T4 must be between 0.19 and 0.25",
          }
        ),
    })
    .optional(),
});

export const inputformSchema = z
  .object({
    analysisType: z.object({
      resinComparison: z.boolean(),
      performanceModel: z.boolean(),
      colourModel: z.boolean(),
    }),
    materialInfo: z
      .object({
        bottle: z.string().min(1, "Select a Bottle"),
        preform: z.string().min(1, "Select a Preform"),
        resins: z
          .array(z.string())
          .nonempty("Select at least one Resin.")
          .max(2, "You can select up to 2 Resins only."),
        reference_resin: z
          .array(z.string())
          .nonempty("Select at least one Resin.")
          .max(1, "You can select up to 1 Resins only.")
          .nullable(),
        location: z.string().optional(),
        machine: z.string().optional(),
        stretchRodSpeed: z
          .string()
          .default("1.3")
          .optional()
          .refine(
            (val) => {
              const num = Number(val);
              return !val || (num >= 1.3 && num <= 2);
            },
            {
              message: "Stretch rod speed must be between 1.3 and 2",
            }
          ),
        massFlowRate: z
          .string()
          .default("20")
          .optional()
          .refine(
            (val) => {
              const num = Number(val);
              return !val || (num >= 5 && num <= 20);
            },
            {
              message: "Mass flow rate must be between 5 and 20",
            }
          ),
      })
      .refine(
        (data) =>
          !data.reference_resin?.some((resin) => data.resins.includes(resin)),
        {
          message: "Selected resins and reference resin must be unique.",
          path: ["reference_resin"], // The field to attach the error to
        }
      ),
    bottleMeasurement: z
      .object({
        sectionWeights: z.object({
          shoulder: z
            .string()
            .optional()
            .refine(
              (val) => {
                const num = Number(val);
                return !val || (num >= 6.8 && num <= 7.9);
              },
              {
                message: "Base must be between 6.8 and 7.9",
              }
            ),
          label: z
            .string()
            .optional()
            .refine(
              (val) => {
                const num = Number(val);
                return !val || (num >= 3.8 && num <= 5.0);
              },
              {
                message: "Label must be between 3.8 and 5.0",
              }
            ),
          grip: z
            .string()
            .optional()
            .refine(
              (val) => {
                const num = Number(val);
                return !val || (num >= 4.5 && num <= 6.0);
              },
              {
                message: "grip must be between 4.5 and 6.0",
              }
            ),
          base: z
            .string()
            .optional()
            .refine(
              (val) => {
                const num = Number(val);
                return !val || (num >= 3.0 && num <= 4.8);
              },
              {
                message: "Base must be between 3.0 and 4.8",
              }
            ),
        }), // We are validating this separately
        thickness: z
          .object({
            t1: z
              .string()
              .optional()
              .refine(
                (val) => {
                  const num = Number(val);
                  return !val || (num >= 0.05 && num <= 0.35);
                },
                {
                  message: "T1 must be between 0.05 and 0.35",
                }
              ),
            t2: z
              .string()
              .optional()
              .refine(
                (val) => {
                  const num = Number(val);
                  return !val || (num >= 0.22 && num <= 0.29);
                },
                {
                  message: "T2 must be between 0.22 and 0.29",
                }
              ),
            t3: z
              .string()
              .optional()
              .refine(
                (val) => {
                  const num = Number(val);
                  return !val || (num >= 0.05 && num <= 0.33);
                },
                {
                  message: "T3 must be between 0.05 and 0.33",
                }
              ),
            t4: z
              .string()
              .optional()
              .refine(
                (val) => {
                  const num = Number(val);
                  return !val || (num >= 0.19 && num <= 0.25);
                },
                {
                  message: "T4 must be between 0.19 and 0.25",
                }
              ),
          })
          .optional(),
      })
      .optional(),
    preformColor: z
      .object({
        l: z.string().optional(),
        a: z.string().optional(),
        b: z.string().optional(),
        haze: z.string().optional(),
      })
      .optional(),
    creepParameters: z
      .object({
        gasVolume: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data: any, ctx: any) => {
    const { resinComparison, performanceModel, colourModel } =
      data.analysisType;

    // Perform the sectionWeights validation here if performanceModel is true
    if (performanceModel && data.bottleMeasurement?.sectionWeights) {
      const sectionWeightsSchema = createSectionWeightsSchema(
        data.materialInfo.preform
      );
      const validation = sectionWeightsSchema.safeParse(
        data.bottleMeasurement.sectionWeights
      );
      if (!validation.success) {
        for (const issue of validation.error.issues) {
          ctx.addIssue(issue); // Add each issue from validation
        }
        ctx.addIssue({
          code: "INVALID_SECTION_WEIGHTS",
          path: ["bottleMeasurement", "sectionWeights"],
          message:
            "Section weights validation failed. Check total weights and try again.",
        });
      }
    }

    if (!colourModel) {
      if (!data.materialInfo.location) {
        ctx.addIssue({
          code: "MISSING_LOCATION",
          path: ["materialInfo", "location"],
          message: "Select a Location",
        });
      }
      if (!data.materialInfo.machine) {
        ctx.addIssue({
          code: "MISSING_MACHINE",
          path: ["materialInfo", "machine"],
          message: "Select a Machine",
        });
      }
    }

    if (resinComparison) {
      if (!data.materialInfo.stretchRodSpeed) {
        ctx.addIssue({
          code: "MISSING_STRETCH_ROD_SPEED",
          path: ["materialInfo", "stretchRodSpeed"],
          message: "Enter Stretch Rod Speed.",
        });
      }
      if (!data.materialInfo.massFlowRate) {
        ctx.addIssue({
          code: "MISSING_MASS_FLOW_RATE",
          path: ["materialInfo", "massFlowRate"],
          message: "Enter Mass Flow Rate.",
        });
      }
    }

    if (performanceModel) {
      const requiredSectionWeights = ["shoulder", "label", "grip", "base"];
      const requiredThicknesses = ["t1", "t2", "t3", "t4"];

      for (const key of requiredSectionWeights) {
        if (!data.bottleMeasurement?.sectionWeights?.[key]) {
          ctx.addIssue({
            code: `MISSING_SECTION_WEIGHT_${key.toUpperCase()}`,
            path: ["bottleMeasurement", "sectionWeights", key],
            message: `Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          });
        }
      }

      for (const key of requiredThicknesses) {
        if (!data.bottleMeasurement?.thickness?.[key]) {
          ctx.addIssue({
            code: `MISSING_THICKNESS_${key.toUpperCase()}`,
            path: ["bottleMeasurement", "thickness", key],
            message: `Enter ${key.toUpperCase()}`,
          });
        }
      }

      if (!data.creepParameters.gasVolume) {
        ctx.addIssue({
          code: "MISSING_gasVolume",
          path: ["creepParameters", "gasVolume"],
          message: "Enter gasVolume",
        });
      }
    }

    if (colourModel) {
      const requiredColors = ["l", "a", "b", "haze"];

      for (const key of requiredColors) {
        if (!data.preformColor?.[key]) {
          ctx.addIssue({
            code: `MISSING_COLOR_${key.toUpperCase()}`,
            path: ["preformColor", key],
            message: `Enter ${key.toUpperCase()}`,
          });
        }
      }
    }
  });
