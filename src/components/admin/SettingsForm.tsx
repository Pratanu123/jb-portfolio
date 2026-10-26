"use client";

import { useState, type ReactNode } from "react";
import { saveSettings } from "@/actions/settings";
import { CoverUpload } from "@/components/admin/CoverUpload";
import { MustReadsEditor, type MustReadOption } from "@/components/admin/MustReadsEditor";
import { unusedCopyKeys, type SiteCopy } from "@/lib/copy";
import type { SocialLink } from "@/lib/types";

type Settings = {
  displayName: string;
  tagline: string;
  bio: string;
  about: string;
  contactEmail: string;
  websiteUrl: string;
  websiteLabel: string;
  heroImage: string;
  socials: SocialLink[];
  copy: SiteCopy;
};

export function SettingsForm({
  settings,
  works,
}: {
  settings: Settings;
  works: MustReadOption[];
}) {
  const [socials, setSocials] = useState(
    settings.socials.length ? settings.socials : [{ label: "LinkedIn", url: "" }],
  );
  const [message, setMessage] = useState("");
  const copy = settings.copy;
  const paragraph = copy.heroVoice.trim() || settings.about.split(/\n\n+/)[0] || settings.bio;

  return (
    <form
      className="space-y-14"
      action={async (formData) => {
        const result = await saveSettings(formData);
        setMessage(result?.error ?? "Saved.");
      }}
    >
      {message ? <p className="border border-teal/30 bg-teal/10 px-4 py-3">{message}</p> : null}

      <Section title="Header">
        <Field label="Name">
          <input name="displayName" defaultValue={settings.displayName} className="field mt-2" />
        </Field>
        <Field label="Home">
          <input name="copy_navHome" defaultValue={copy.navHome} className="field mt-2" />
        </Field>
        <Field label="Categories">
          <input name="copy_navCategories" defaultValue={copy.navCategories} className="field mt-2" />
        </Field>
        <Field label="About">
          <input name="copy_navAbout" defaultValue={copy.navAbout} className="field mt-2" />
        </Field>
        <Field label="Contact">
          <input name="copy_navContact" defaultValue={copy.navContact} className="field mt-2" />
        </Field>
        <Field label="Visit my website">
          <input name="websiteLabel" defaultValue={settings.websiteLabel} className="field mt-2" />
        </Field>
        <Field label="Menu">
          <input name="copy_navMenu" defaultValue={copy.navMenu} className="field mt-2" />
        </Field>
        <Field label="Close">
          <input name="copy_navClose" defaultValue={copy.navClose} className="field mt-2" />
        </Field>
        <Field label="Back">
          <input name="copy_navBack" defaultValue={copy.navBack} className="field mt-2" />
        </Field>
        <Field label="Back to home">
          <input name="copy_navBackHome" defaultValue={copy.navBackHome} className="field mt-2" />
        </Field>
        <Field label="Back to categories">
          <input name="copy_navBackCategories" defaultValue={copy.navBackCategories} className="field mt-2" />
        </Field>
      </Section>

      <Section title="Home — hero">
        <p className="text-sm text-ink/55">
          The heading and portrait sit together toward the center. A gold dot appears between each word when the join field is empty.
        </p>
        <Field label="Line 1">
          <input name="copy_heroLine1" defaultValue={copy.heroLine1} className="field mt-2" />
        </Field>
        <Field label="Line 2">
          <input name="copy_heroLine2" defaultValue={copy.heroLine2} className="field mt-2" />
        </Field>
        <Field label="Line 3">
          <input name="copy_heroLine3" defaultValue={copy.heroLine3} className="field mt-2" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First word">
            <input name="copy_heroStep1" defaultValue={copy.heroStep1} className="field mt-2" />
          </Field>
          <Field label="Second word">
            <input name="copy_heroStep2" defaultValue={copy.heroStep2} className="field mt-2" />
          </Field>
          <Field label="Third word">
            <input name="copy_heroStep3" defaultValue={copy.heroStep3} className="field mt-2" />
          </Field>
          <Field label="Fourth word">
            <input name="copy_heroStep4" defaultValue={copy.heroStep4} className="field mt-2" />
          </Field>
        </div>
        <Field label="Between the words">
          <input name="copy_heroStepJoin" defaultValue={copy.heroStepJoin} className="field mt-2" />
          <span className="mt-1 block text-sm text-ink/55">Leave blank for the gold dots. Type a word here only if you want that instead of the dots.</span>
        </Field>
        <Field label="Paragraph">
          <textarea name="copy_heroVoice" rows={5} defaultValue={paragraph} className="field mt-2" />
        </Field>
        <Field label="Portrait description">
          <input name="copy_heroImageAlt" defaultValue={copy.heroImageAlt} className="field mt-2" />
        </Field>
        <div>
          <p className="label text-violet">Portrait</p>
          <div className="mt-2">
            <CoverUpload
              name="heroImage"
              initial={settings.heroImage}
              previewClass="aspect-square max-w-80 bg-black"
              contain
              allowPath
              hint="JPG, PNG, WebP, GIF, or MP4. Keep the full figure so the animation stays visible."
            />
          </div>
        </div>
      </Section>

      <Section title="Home — Must reads">
        <Field label="Heading">
          <input name="copy_mustReadsHeading" defaultValue={copy.mustReadsHeading} className="field mt-2" />
        </Field>
        <Field label="Read more">
          <input name="copy_readMore" defaultValue={copy.readMore} className="field mt-2" />
        </Field>
        <MustReadsEditor works={works} />
      </Section>

      <Section title="Home — Categories">
        <Field label="Heading">
          <input name="copy_categoriesHeading" defaultValue={copy.categoriesHeading} className="field mt-2" />
        </Field>
        <p className="text-sm text-ink/55">Category names and gold marks are edited under Categories.</p>
      </Section>

      <Section title="Home — About">
        <p className="text-sm text-ink/55">
          The About me block on the home page only. It sits toward the center. Visit my website and LinkedIn appear here, not on the About page.
        </p>
        <Field label="Heading">
          <input name="copy_aboutHeading" defaultValue={copy.aboutHeading} className="field mt-2" />
        </Field>
        <Field label="Text">
          <textarea name="about" rows={6} defaultValue={settings.about} className="field mt-2" />
        </Field>
        <Field label="Website link">
          <input name="websiteUrl" defaultValue={settings.websiteUrl} className="field mt-2" />
        </Field>
        {socials.map((social, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-2">
            <Field label="Social name">
              <input
                name="socialLabel"
                placeholder="LinkedIn"
                defaultValue={social.label}
                className="field mt-2"
              />
            </Field>
            <Field label="Social link">
              <input
                name="socialUrl"
                placeholder="https://"
                defaultValue={social.url}
                className="field mt-2"
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          className="label text-teal"
          onClick={() => setSocials((items) => [...items, { label: "", url: "" }])}
        >
          Add a link
        </button>
      </Section>

      <Section title="Footer">
        <p className="text-sm text-ink/55">
          Words on the left. The inkwell animation stays on the right. The name under the heading is the Header name.
        </p>
        <Field label="Heading">
          <input name="copy_footerFriends" defaultValue={copy.footerFriends} className="field mt-2" />
        </Field>
        <Field label="Tagline">
          <input name="tagline" defaultValue={settings.tagline} className="field mt-2" />
        </Field>
        <Field label="Menu">
          <input name="copy_footerMenu" defaultValue={copy.footerMenu} className="field mt-2" />
        </Field>
        <Field label="Contact">
          <input name="copy_footerContact" defaultValue={copy.footerContact} className="field mt-2" />
        </Field>
        <Field label="Back to top">
          <input name="copy_footerBackToTop" defaultValue={copy.footerBackToTop} className="field mt-2" />
        </Field>
      </Section>

      <Section title="Inside an article">
        <Field label="Return to previous section">
          <input name="copy_workReturn" defaultValue={copy.workReturn} className="field mt-2" />
        </Field>
        <Field label="Categories menu">
          <input name="copy_workCategoriesMenu" defaultValue={copy.workCategoriesMenu} className="field mt-2" />
        </Field>
      </Section>

      <Section title="About page">
        <p className="text-sm text-ink/55">
          The About page opened from About in the navigation. This is not the home About block, and it has no website or LinkedIn rows.
        </p>
        <Field label="Heading">
          <input name="copy_aboutPageHeading" defaultValue={copy.aboutPageHeading} className="field mt-2" />
        </Field>
        <Field label="Text">
          <textarea name="copy_aboutPageText" rows={12} defaultValue={copy.aboutPageText} className="field mt-2" />
        </Field>
      </Section>

      <Section title="Contact page">
        <Field label="Small line">
          <input name="copy_contactEyebrow" defaultValue={copy.contactEyebrow} className="field mt-2" />
        </Field>
        <Field label="Heading">
          <input name="copy_contactHeading" defaultValue={copy.contactHeading} className="field mt-2" />
        </Field>
        <Field label="Introduction">
          <textarea name="copy_contactIntro" rows={3} defaultValue={copy.contactIntro} className="field mt-2" />
        </Field>
        <Field label="Email">
          <input
            name="contactEmail"
            type="email"
            defaultValue={settings.contactEmail}
            className="field mt-2"
          />
        </Field>
        <Field label="Name field">
          <input name="copy_contactNameLabel" defaultValue={copy.contactNameLabel} className="field mt-2" />
        </Field>
        <Field label="Email field">
          <input name="copy_contactEmailLabel" defaultValue={copy.contactEmailLabel} className="field mt-2" />
        </Field>
        <Field label="Message field">
          <input name="copy_contactMessageLabel" defaultValue={copy.contactMessageLabel} className="field mt-2" />
        </Field>
        <Field label="Send button">
          <input name="copy_contactSubmit" defaultValue={copy.contactSubmit} className="field mt-2" />
        </Field>
        <Field label="Thank-you note">
          <textarea name="copy_contactSuccess" rows={2} defaultValue={copy.contactSuccess} className="field mt-2" />
        </Field>
      </Section>

      <input type="hidden" name="bio" value={settings.bio} />
      {unusedCopyKeys().map((key) => (
        <input key={key} type="hidden" name={`copy_${key}`} value={copy[key]} />
      ))}

      <div className="sticky bottom-0 z-10 -mx-5 border-t border-violet/15 bg-cream/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
        <button className="btn-gold" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-title text-2xl">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label text-violet">{label}</span>
      {children}
    </label>
  );
}
