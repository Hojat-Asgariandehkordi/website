import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * A small, safe renderer for the markdown subset used in content files:
 * ## headings, paragraphs, - bullets, 1. numbered lists, **bold** and [links](url).
 * No raw HTML is ever rendered.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={`${keyBase}-${i++}`} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    else {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out.push(
        href.startsWith("/") ? (
          <Link key={`${keyBase}-${i++}`} href={href} className="link">{label}</Link>
        ) : (
          <a key={`${keyBase}-${i++}`} href={href} className="link" target="_blank" rel="noopener noreferrer">{label}</a>
        ),
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-5 text-[17px] leading-[1.75] text-ink">
      {blocks.map((block, b) => {
        const lines = block.split("\n");
        const key = `b${b}`;
        if (lines[0].startsWith("## ")) {
          const rest = lines.slice(1).join("\n").trim();
          return (
            <Fragment key={key}>
              <h2 className="pt-4 font-serif text-2xl text-cedar-900">{lines[0].slice(3)}</h2>
              {rest && <Markdown source={rest} />}
            </Fragment>
          );
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={key} className="list-disc space-y-2 pl-6 marker:text-cedar-500">
              {lines.map((l, i) => <li key={i}>{inline(l.slice(2), `${key}-${i}`)}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={key} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-cedar-700">
              {lines.map((l, i) => <li key={i}>{inline(l.replace(/^\d+\. /, ""), `${key}-${i}`)}</li>)}
            </ol>
          );
        }
        return <p key={key}>{inline(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
