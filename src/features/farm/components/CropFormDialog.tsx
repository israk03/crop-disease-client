"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";

import {
  createCropSchema,
  type CreateCropFormValues,
} from "@/schemas/crop.schema";

import type { Crop } from "@/types/api.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CropFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateCropFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Crop;
  mode: "create" | "edit";
}

const DEFAULT_VALUES: CreateCropFormValues = {
  name: "",
  variety: "",
  plantingDate: "",
  expectedHarvestDate: "",
  notes: "",
  status: undefined,
};

export function CropFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode,
}: CropFormDialogProps) {
  const form = useForm<CreateCropFormValues>({
    resolver: zodResolver(createCropSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  // Watch planting date to enforce dynamic date limits on harvest validation fields
  const watchPlantingDate = useWatch({
  control: form.control,
  name: "plantingDate",
});

  useEffect(() => {
    if (!open) {
      form.reset(DEFAULT_VALUES);
      return;
    }

    if (mode === "edit" && defaultValues) {
      form.reset({
        name: defaultValues.name,
        variety: defaultValues.variety ?? "",
        plantingDate: defaultValues.plantingDate
          ? defaultValues.plantingDate.slice(0, 10)
          : "",
        expectedHarvestDate: defaultValues.expectedHarvestDate
          ? defaultValues.expectedHarvestDate.slice(0, 10)
          : "",
        notes: defaultValues.notes ?? "",
        status: defaultValues.status ?? undefined,
      });
    }
  }, [open, mode, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0f1115] border-zinc-800 text-zinc-100 shadow-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-mono font-bold uppercase tracking-tight text-zinc-100 text-base">
            {mode === "create" ? "Initialize Crop Track" : "Modify Crop Metrics"}
          </DialogTitle>

          <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-1">
            {mode === "create"
              ? "Register a new crop record to begin telemetry lifecycle observation hooks."
              : "Update crop configuration values, notes, and lifecycle parameters."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
            className="space-y-4 pt-2"
          >
            {/* Input Row: Name + Variety */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Crop Name <span className="text-rose-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="e.g. Aman Rice"
                        className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variety"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Cultivar Variety
                    </FormLabel>

                    <FormControl>
                      <Input
  placeholder="e.g. BRRI dhan75"
  value={(field.value as string) ?? ""}
  onChange={field.onChange}
  onBlur={field.onBlur}
  name={field.name}
  ref={field.ref}
  className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
/>
                    </FormControl>

                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />
            </div>

            {/* Input Row: Planting Date + Harvest Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="plantingDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Planting Date <span className="text-rose-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115] font-mono text-xs dark:scheme-dark"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedHarvestDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Expected Harvest
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        min={watchPlantingDate || undefined}
                        className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115] font-mono text-xs dark:scheme-dark"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />
            </div>

            {/* Select Input: Status Field (Only active in Edit mode) */}
            {mode === "edit" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Lifecycle Track Status
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 bg-[#14171c] border-zinc-800 text-zinc-300 rounded-xl focus:ring-emerald-500 focus:ring-offset-[#0f1115]">
                          <SelectValue placeholder="Select current status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="bg-[#0f1115] border-zinc-800 text-zinc-300 rounded-xl">
                        <SelectItem value="GROWING" className="focus:bg-zinc-800 focus:text-white rounded-lg">
                          🌱 Growing
                        </SelectItem>
                        <SelectItem value="HARVESTED" className="focus:bg-zinc-800 focus:text-white rounded-lg">
                          ✅ Harvested
                        </SelectItem>
                        <SelectItem value="FAILED" className="focus:bg-zinc-800 focus:text-white rounded-lg">
                          ❌ Failed
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />
            )}

            {/* Field: Notes textarea area */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-zinc-300">
                    Observation Logs / Notes
                  </FormLabel>

                  <FormControl>
                    <Textarea
  placeholder="Enter soil prep, weather mutations, treatment status logging..."
  rows={3}
  value={(field.value as string) ?? ""}
  onChange={field.onChange}
  onBlur={field.onBlur}
  name={field.name}
  ref={field.ref}
  className="resize-none bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115] text-sm p-3 min-h-20"
/>
                  </FormControl>

                  <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                </FormItem>
              )}
            />

            {/* Footer Action Controls Layout */}
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider h-10 px-4"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-4 gap-2 transition-all shadow-lg shadow-emerald-500/5"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                )}
                {mode === "create" ? "Add Track" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}