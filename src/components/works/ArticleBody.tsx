import { renderArticleHtml } from "@/lib/article";

export function ArticleBody({
  body,
  emptyLabel,
}: {
  body: unknown;
  emptyLabel: string;
}) {
  const html = renderArticleHtml(body);
  if (!html) {
    return <p className="folio-body">{emptyLabel}</p>;
  }
  return (
    <>
      <style>{`
        .article-body audio { display: block; width: 100%; margin: 1.4rem 0; }
        .article-audio, .article-attachment-wrap { margin: 1.6rem 0; }
        .article-audio figcaption, .article-attachment { color: #e8c56b; font-size: 0.95rem; }
        .article-audio figcaption.is-empty { display: none; }
        .article-body mark { color: inherit; padding: 0 0.12em; }
        .article-body [data-indent="1"] { margin-left: 1.5rem; }
        .article-body [data-indent="2"] { margin-left: 3rem; }
        .article-body [data-indent="3"] { margin-left: 4.5rem; }
        .article-body [data-indent="4"] { margin-left: 6rem; }
        .article-body [data-indent="5"] { margin-left: 7.5rem; }
        .article-body [data-indent="6"] { margin-left: 9rem; }
        .article-body [data-indent="7"] { margin-left: 10.5rem; }
        .article-body [data-indent="8"] { margin-left: 12rem; }
        .article-body blockquote.is-pullquote { border-left: none; margin: 2rem auto; max-width: 36rem; padding: 0.4rem 1.2rem; text-align: center; color: #e8c56b; font-family: var(--font-body), "EB Garamond", serif; font-size: 1.25rem; line-height: 1.5; font-style: normal; }
      `}</style>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
