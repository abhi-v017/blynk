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
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-surface border rounded-xl p-3 sm:p-3.5 mb-2.5 flex items-start gap-2.5 sm:gap-3 transition-colors ${
        link.isActive ? "border-border shadow-xs" : "border-border/60 opacity-60 bg-surface-raised/40"
      }`}
    >
      {/* Touch-friendly Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1.5 sm:mt-2 text-muted hover:text-text cursor-grab active:cursor-grabbing touch-none p-1.5 sm:p-1 rounded transition-colors shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0 flex flex-col xs:flex-row gap-2">
        {showIconInput && (
          <div className="w-full xs:w-12 shrink-0">
            <TextInput
              value={link.icon || ""}
              onChange={(e) => onChange({ icon: e.target.value })}
              placeholder="✨"
              className="text-center h-10 xs:h-9 text-base"
              maxLength={2}
            />
          </div>
        )}
        <div className="flex-1 space-y-1.5 min-w-0">
          <TextInput
            value={link.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Link title (e.g. My Portfolio)"
          />
          <TextInput
            value={link.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://example.com"
            className="font-mono text-xs text-muted"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-0.5 sm:mt-1 shrink-0">
        <Toggle checked={link.isActive} onChange={(v) => onChange({ isActive: v })} />
        <button
          type="button"
          onClick={onDelete}
          className="text-muted hover:text-rose-500 p-1.5 sm:p-1 rounded transition-colors"
          title="Delete link"
          aria-label="Delete link"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
