import { Caption, Panel } from "@/components/comic/ComicKit";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  const { copy } = settings;

  return (
    <div className="page-shell">
      <Caption>{copy.contactEyebrow}</Caption>
      <div className="tier tier-2">
        <Panel className="py-2 md:py-4">
          <h1 className="font-display folio-display break-words">{copy.contactHeading}</h1>
          <p className="folio-body mt-5">{copy.contactIntro}</p>
          <a href={`mailto:${settings.contactEmail}`} className="mt-6 inline-block break-all text-[17px] underline sm:text-xl">
            {settings.contactEmail}
          </a>
        </Panel>
        <Panel className="p-6 md:p-8">
          <ContactForm
            nameLabel={copy.contactNameLabel}
            emailLabel={copy.contactEmailLabel}
            messageLabel={copy.contactMessageLabel}
            submitLabel={copy.contactSubmit}
            submittingLabel={copy.contactSubmitting}
            successMessage={copy.contactSuccess}
          />
        </Panel>
      </div>
    </div>
  );
}
