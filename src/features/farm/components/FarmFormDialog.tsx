"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Check } from "lucide-react";

import {
  createFarmSchema,
  type CreateFarmFormValues,
} from "@/schemas/farm.schema";
import type { Farm } from "@/types/api.types";

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
import { Button } from "@/components/ui/button";

const SOIL_TYPES = [
  { value: "CLAY", label: "Clay" },
  { value: "SANDY", label: "Sandy" },
  { value: "LOAMY", label: "Loamy" },
  { value: "SILTY", label: "Silty" },
  { value: "PEATY", label: "Peaty" },
  { value: "CHALKY", label: "Chalky" },
  { value: "OTHER", label: "Other" },
] as const;

// Clean type-safe structural default values
const DEFAULT_VALUES: Partial<CreateFarmFormValues> = {
  name: "",
  address: "",
  region: "",
  
};

interface FarmFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting: boolean;
  defaultValues?: Farm;
  mode: "create" | "edit";
}

export function FarmFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode,
}: FarmFormDialogProps) {
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<CreateFarmFormValues>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: DEFAULT_VALUES as CreateFarmFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      form.reset(DEFAULT_VALUES as CreateFarmFormValues);
      return;
    }

    if (mode === "edit" && defaultValues) {
      form.reset({
        name: defaultValues.name,
        size: defaultValues.size,
        soilType: defaultValues.soilType,
        address: defaultValues.address,
        region: defaultValues.region,
        longitude: defaultValues.location?.coordinates?.[0],
        latitude: defaultValues.location?.coordinates?.[1],
      });
    }
  }, [open, mode, defaultValues, form]);

  // One-click native GPS lookups
  const handleCaptureCoordinates = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("longitude", Number(position.coords.longitude.toFixed(6)), { shouldValidate: true });
        form.setValue("latitude", Number(position.coords.latitude.toFixed(6)), { shouldValidate: true });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (values: CreateFarmFormValues) => {
    const payload: Record<string, unknown> = {
      name: values.name,
      size: values.size,
      soilType: values.soilType,
      address: values.address,
      region: values.region,
    };

    if (typeof values.longitude === "number" && typeof values.latitude === "number") {
      payload.location = {
        type: "Point",
        coordinates: [values.longitude, values.latitude],
      };
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0f1115] border-zinc-800 text-zinc-100 shadow-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-mono font-bold uppercase tracking-tight text-zinc-100 text-base">
            {mode === "create" ? "Register New Plot Area" : "Edit Asset Profile"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-1">
            {mode === "create"
              ? "Link coordinate configurations to optimize microclimate weather diagnostics."
              : "Modify structural data dimensions and validation values below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            
            {/* Field: Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-zinc-300">
                    Farm Identity Label <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      placeholder="e.g. North Gazipur Agro Field"
                      className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                </FormItem>
              )}
            />

            {/* Fields Row: Size + Soil Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Total Area Size (ha) <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 4.25"
                        className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
                        value={
  typeof field.value === "number"
    ? field.value
    : ""
}
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-bold text-zinc-300">
                      Soil Composition Layer <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-[#14171c] border-zinc-800 text-zinc-300 rounded-xl focus:ring-emerald-500 focus:ring-offset-[#0f1115]">
                          <SelectValue placeholder="Select classification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0f1115] border-zinc-800 text-zinc-300 rounded-xl">
                        {SOIL_TYPES.map((soil) => (
                          <SelectItem key={soil.value} value={soil.value} className="focus:bg-zinc-800 focus:text-white rounded-lg">
                            {soil.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                  </FormItem>
                )}
              />
            </div>

            {/* Field: Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-zinc-300">
                    Geographic Address <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Village Road, Zone 4"
                      className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                </FormItem>
              )}
            />

            {/* Field: Region */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold text-zinc-300">
                    Administrative Region <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Gazipur"
                      className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115]"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                </FormItem>
              )}
            />

            {/* Field Block: GPS Coordinate Arrays */}
            <div className="space-y-2 border-t border-zinc-800/60 pt-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-bold text-zinc-300">
                  Telemetry Coordinates <span className="text-zinc-600 font-normal font-mono text-[10px] uppercase pl-1">(Optional)</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCaptureCoordinates}
                  disabled={isLocating || isSubmitting}
                  className="h-7 px-2.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 gap-1.5 transition-all"
                >
                  {isLocating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  Locate Field
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Longitude (X)"
                          className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115] font-mono text-xs"
                          value={
  typeof field.value === "number"
    ? field.value
    : ""
}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Latitude (Y)"
                          className="h-10 bg-[#14171c] border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-xl focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0f1115] font-mono text-xs"
                          value={
  typeof field.value === "number"
    ? field.value
    : ""
}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-[11px] font-medium font-mono" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dialog Form Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800/40">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
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
                {mode === "create" ? "Create Asset" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}