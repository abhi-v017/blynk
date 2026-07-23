"use client";

import { useEditorStore } from "@/lib/editor-store";
import { Field, TextInput, TextArea, Panel } from "@/components/ui";
import ImageUpload from "@/components/ImageUpload";

export default function ProfilePage() {
  const { profile, setProfile } = useEditorStore();
  if (!profile) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        Profile
      </h1>
      <p className="text-sm text-muted mb-6">
        This is what visitors see first. Keep it human — a name, a line about you, a face.
      </p>

      <Panel title="Identity">
        <Field label="Display name">
          <TextInput
            value={profile.displayName}
            onChange={(e) => setProfile({ displayName: e.target.value })}
            placeholder="Abek Sharma"
            maxLength={40}
          />
        </Field>

        <Field label="Bio" hint={`${profile.bio.length}/160`}>
          <TextArea
            value={profile.bio}
            onChange={(e) => setProfile({ bio: e.target.value.slice(0, 160) })}
            placeholder="Designer building small, honest things on the internet."
            rows={3}
          />
        </Field>

        <Field label="Profile picture" hint="upload or paste link">
          <ImageUpload
            value={profile.profilePic}
            onChange={(v) => setProfile({ profilePic: v })}
            aspectRatio={1}
            folder="users"
          />
        </Field>
      </Panel>

      <Panel title="Your address">
        <div className="text-sm text-muted">
          Your page lives at{" "}
          <span className="text-accent" style={{ fontFamily: "var(--font-label)" }}>
            bento.page/{profile.username}
          </span>
          . Usernames can&apos;t be changed yet — reach out if you need a swap.
        </div>
      </Panel>
    </div>
  );
}
