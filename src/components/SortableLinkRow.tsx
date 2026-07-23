"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { LinkItem } from "@/lib/types";
import { TextInput, Toggle } from "./ui";

export default function SortableLinkRow({
  link,
  showIconInput,
  onChange,
  onDelete,
}: {
  link: LinkItem;
  showIconInput?: boolean;
  onChange: (patch: Partial<LinkItem>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface border border-border rounded-xl p-3 mb-2.5 flex items-start gap-2.5"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2.5 text-muted hover:text-text cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0 flex gap-2">
        {showIconInput && (
          <div className="w-14 shrink-0">
            <TextInput
              value={link.icon || ""}
              onChange={(e) => onChange({ icon: e.target.value })}
              placeholder="Icon"
              className="text-center h-19"
              maxLength={2}
            />
          </div>
        )}
        <div className="flex-1">
          <TextInput
            value={link.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Link title"
            className="mb-2"
          />
          <TextInput
            value={link.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-1.5 shrink-0">
        <Toggle checked={link.isActive} onChange={(v) => onChange({ isActive: v })} />
        <button
          type="button"
          onClick={onDelete}
          className="text-muted hover:text-accent transition-colors"
          aria-label="Delete link"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
