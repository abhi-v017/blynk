"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEditorStore } from "@/lib/editor-store";
import { createLink, updateLink, deleteLink, reorderLinks } from "@/lib/firestore";
import SortableLinkRow from "@/components/SortableLinkRow";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";

export default function LinksPage() {
  const { user } = useAuth();
  const { links, setLinks, upsertLink, removeLink, theme } = useEditorStore();
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Both pointer and touch sensors configured for fluid mobile and desktop interactions
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  );

  const sorted = [...links].sort((a, b) => a.order - b.order);
  const activeCount = sorted.filter((l) => l.isActive).length;

  async function handleAdd() {
    if (!user) return;
    const newLink = { title: "", url: "", order: links.length, isActive: true };
    const id = await createLink(user.uid, newLink);
    upsertLink({ id, ...newLink });
  }

  function handleChange(id: string, patch: Partial<{ title: string; url: string; isActive: boolean; icon?: string }>) {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    upsertLink({ ...link, ...patch });
    setPendingId(id);
  }

  useDebouncedEffect(() => {
    if (!user || !pendingId) return;
    const link = links.find((l) => l.id === pendingId);
    if (!link) return;
    updateLink(user.uid, pendingId, {
      title: link.title,
      url: link.url,
      isActive: link.isActive,
      icon: link.icon || "",
    });
  }, [links, pendingId], 500);

  async function handleDelete(id: string) {
    if (!user) return;
    removeLink(id);
    await deleteLink(user.uid, id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !user) return;
    const oldIndex = sorted.findIndex((l) => l.id === active.id);
    const newIndex = sorted.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex).map((l, i) => ({ ...l, order: i }));
    setLinks(reordered);
    await reorderLinks(user.uid, reordered.map((l) => l.id));
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-text mb-0.5 sm:mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Manage Links
          </h1>
          <p className="text-xs text-muted">
            Drag to reorder destination buttons. Toggle visibility without deleting.
          </p>
        </div>
        <div className="text-[11px] font-mono text-muted bg-surface border border-border px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
          {activeCount} of {sorted.length} active
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full bg-surface border border-border hover:border-accent hover:bg-surface-raised rounded-xl py-3 sm:py-2.5 text-xs font-medium text-text transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99]"
      >
        <Plus size={14} /> Add new link
      </button>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sorted.map((link) => (
              <SortableLinkRow
                key={link.id}
                link={link}
                showIconInput={theme?.button?.iconStyle === "custom"}
                onChange={(patch) => handleChange(link.id, patch)}
                onDelete={() => handleDelete(link.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sorted.length === 0 && (
        <div className="text-center py-10 sm:py-12 px-4 border border-dashed border-border rounded-xl bg-surface/50 text-muted">
          <p className="text-xs mb-2">You haven&apos;t added any links yet.</p>
          <button
            onClick={handleAdd}
            className="text-xs text-text underline hover:text-accent font-medium py-1"
          >
            Create your first link
          </button>
        </div>
      )}
    </div>
  );
}
