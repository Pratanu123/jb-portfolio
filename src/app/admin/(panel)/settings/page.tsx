import { AdminBack } from "@/components/admin/AdminBack";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getMustReadOptions, getSettings } from "@/lib/data";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const [settings, works] = await Promise.all([getSettings(), getMustReadOptions()]);
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <AdminBack href="/admin" label="Back to admin" />
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/65">
        In the same order as the site: header, home, footer, About page, then contact.
        Home About and the hero sit toward the center. The footer keeps its words on the left and the inkwell mark on the right.
      </p>
      <div className="mt-8">
        <SettingsForm
          settings={settings}
          works={works.map((work) => ({
            id: work.id,
            title: work.title,
            excerpt: work.excerpt,
            coverImageUrl: work.coverImageUrl,
            featured: work.featured,
            featuredOrder: work.featuredOrder,
            categoryName: work.category.name,
          }))}
        />
      </div>
    </div>
  );
}
