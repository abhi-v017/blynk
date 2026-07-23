"use client";

import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const sorted = [...links].sort((a, b) => a.order - b.order);

  async function handleAdd() {
    if (!user) return;
    const newLink = { title: "", url: "", order: links.length, isActive: true };
    const id = await createLink(user.uid, newLink);
    upsertLink({ id, ...newLink });
  }

  function handleChange(id: string, patch: Partial<{ title: string; url: string; isActive: boolean }>) {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    upsertLink({ ...link, ...patch });
    setPendingId(id);
  }

  useDebouncedEffect(() => {
    if (!user || !pendingId) return;
    const link = links.find((l) => l.id === pendingId);
    if (!link) return;
    updateLink(user.uid, pendingId, { title: link.title, url: link.url, isActive: link.isActive });
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          Links
        </h1>
      </div>
      <p className="text-sm text-muted mb-6">
        Drag to reorder. Toggle off to hide a link without deleting it.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((link) => (
            <SortableLinkRow
              key={link.id}
              link={link}
              showIconInput={theme?.button?.iconStyle === "custom"}
              onChange={(patch) => handleChange(link.id, patch)}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sorted.length === 0 && (
        <div className="text-sm text-muted border border-dashed border-border rounded-xl p-6 text-center mb-3">
          No links yet. Add your first one below.
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full border border-dashed border-border rounded-xl py-3 text-sm text-muted hover:text-accent hover:border-accent transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus size={15} /> Add link
      </button>
    </div>
  );
}
