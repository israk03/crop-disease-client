"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tractor } from "lucide-react";

import {
  useMyFarms,
  useCreateFarm,
  useUpdateFarm,
  useDeleteFarm,
} from "@/features/farm/hook/use-farms";
import { FarmCard } from "./FarmCard";
import { FarmFormDialog } from "./FarmFormDialog";
import { Button } from "@/components/ui/button";
import type { Farm } from "@/types/api.types";

import type { FarmFormValues } from "@/schemas/farm.schema";

import type {
  CreateFarmPayload,
  UpdateFarmPayload,
} from "@/services/farm.service";

function FarmCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#14171c] overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-zinc-800" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0f1115] border border-zinc-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-36 bg-[#0f1115] rounded" />
            <div className="h-3 w-20 bg-[#0f1115] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-[#0f1115]" />
          ))}
        </div>
        <div className="h-3 w-48 bg-[#0f1115] rounded" />
        <div className="h-9 w-full rounded-lg bg-[#0f1115]" />
      </div>
    </div>
  );
}

function buildFarmPayload(values: FarmFormValues): CreateFarmPayload {
  return {
    name:     values.name,
    size:     values.size as number,   
    soilType: values.soilType,
    address:  values.address,
    region:   values.region,
    ...(values.longitude !== undefined &&
      values.latitude !== undefined && {
        location: {
          longitude: values.longitude as number,
          latitude:  values.latitude  as number,
        },
      }),
  };
}

export function FarmListClient() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  const { data: farms = [], isLoading } = useMyFarms();
  const createMutation = useCreateFarm();
  const deleteMutation = useDeleteFarm();
  
  // Pass an empty string if no farm is selected to avoid breaking React hook execution rules
  const updateMutation = useUpdateFarm(editingFarm?._id ?? "");

  const handleCreate = (values: FarmFormValues) => {
  const payload: CreateFarmPayload = buildFarmPayload(values);
  createMutation.mutate(payload, {
    onSuccess: () => setDialogOpen(false),
  });
};

  const handleUpdate = (values: FarmFormValues) => {
  if (!editingFarm) return;
  const payload: UpdateFarmPayload = buildFarmPayload(values);
  updateMutation.mutate(payload, {
    onSuccess: () => {
      setEditingFarm(null);
      setDialogOpen(false);
    },
  });
};

  const handleEditClick = (farm: Farm) => {
    setEditingFarm(farm);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingFarm(null);
  };

  const isMode = editingFarm ? "edit" : "create";
  const isSubmitting = isMode === "create" ? createMutation.isPending : updateMutation.isPending;

  return (
    <div className="space-y-6 min-h-screen bg-[#0f1115] text-zinc-100 p-1">
      {/* Header Panel section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/30 border border-emerald-800/30">
              <Tractor className="h-4 w-4 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold font-mono uppercase tracking-tight text-zinc-100">
              My Farms
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400 pl-10">
            {isLoading
              ? "Fetching real-time registry telemetry..."
              : farms.length === 0
              ? "No registered systems discovered."
              : `${farms.length} active node${farms.length !== 1 ? "s" : ""} online.`}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingFarm(null);
            setDialogOpen(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-4 gap-2 transition-all shadow-lg shadow-emerald-500/5 shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Farm
        </Button>
      </div>

      {/* Primary Display View Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <FarmCardSkeleton key={i} />
          ))}
        </div>
      ) : farms.length === 0 ? (
        /* Empty System Framework Layout Placement */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-zinc-800 bg-[#14171c]/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-950/20 border border-emerald-800/20 mb-4">
            <Tractor className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-200 mb-1">
            No Infrastructure Nodes Found
          </p>
          <p className="text-xs text-zinc-400 mb-5 max-w-xs leading-relaxed">
            Initialize your primary tracking node to enable location-based environmental data queries and crop diagnostic tracking.
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-4 gap-2"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Register Primary Farm Node
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {farms.map((farm, i) => (
            <motion.div
              key={farm._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, ease: "easeOut" }}
            >
              <FarmCard
                farm={farm}
                onEdit={handleEditClick}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === farm._id
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* System Modal Controls Entry Overlay */}
      <FarmFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={isMode === "create" ? handleCreate : handleUpdate}
        isSubmitting={isSubmitting}
        defaultValues={editingFarm ?? undefined}
        mode={isMode}
      />
    </div>
  );
}