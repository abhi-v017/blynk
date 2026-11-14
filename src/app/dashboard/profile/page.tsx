"use client";

import { useEditorStore } from "@/lib/editor-store";
import { Field, TextInput, TextArea, Panel } from "@/components/ui";
import ImageUpload from "@/components/ImageUpload";

export default function ProfilePage() {
  const { profile, setProfile } = useEditorStore();
  if (!profile) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-text mb-0.5 sm:mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Profile Details
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          Set up your public identity: name, brief bio, and avatar.
        </p>
      </div>

      <Panel title="Identity" description="Basic information displayed on your bio page">
        <Field label="Display name" hint={`${profile.displayName.length}/40`}>
          <TextInput
            value={profile.displayName}
            onChange={(e) => setProfile({ displayName: e.target.value })}
            placeholder="Your Name"
            maxLength={40}
          />
        </Field>

        <Field label="Bio" hint={`${profile.bio.length}/160`}>
          <TextArea
            value={profile.bio}
            onChange={(e) => setProfile({ bio: e.target.value.slice(0, 160) })}
            placeholder="A short sentence about who you are and what you make."
            rows={3}
          />
        </Field>

        <Field label="Profile Avatar" hint="Upload image or paste direct image URL">
          <ImageUpload
            value={profile.profilePic}
            onChange={(v) => setProfile({ profilePic: v })}
            aspectRatio={1}
            folder="users"
          />
        </Field>
      </Panel>

      <Panel title="Claimed Address">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-muted">
          <div className="truncate">
            Your page is live at{" "}
            <span className="font-mono text-text font-medium bg-surface-raised px-1.5 py-0.5 rounded border border-border">
              blynk.page/{profile.username}
            </span>
          </div>
          <span className="text-[11px] text-muted/70 shrink-0">Unique ID</span>
        </div>
      </Panel>
    </div>
  );
}
