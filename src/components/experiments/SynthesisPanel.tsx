import {
  CheckCircle2,
  HelpCircle,
  GitBranch,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { Synthesis } from "../../lib/signalroom";
export function SynthesisPanel({ synthesis }: { synthesis: Synthesis }) {
  const sections = [
    {
      key: "evidence",
      title: "What the feedback supports",
      icon: CheckCircle2,
    },
    { key: "confusions", title: "What’s still unclear", icon: HelpCircle },
    { key: "contradictions", title: "Where opinions split", icon: GitBranch },
  ] as const;
  return (
    <article className="analysis-content">
      <div className="analysis-summary">
        <span className="feature-icon">
          <Sparkles size={22} aria-hidden />
        </span>
        <div>
          <p className="eyebrow">
            INTERPRETATION · {synthesis.responseCount} RESPONSES
          </p>
          <h3>{synthesis.strongestVariant}</h3>
          <p>{synthesis.summary}</p>
        </div>
      </div>
      <div className="insight-grid">
        {sections.map(({ key, title, icon: Icon }) => (
          <section className={`insight-card insight-${key}`} key={key}>
            <h4>
              <Icon size={18} aria-hidden />
              {title}
            </h4>
            {synthesis[key].length ? (
              <ul>
                {synthesis[key].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="caption">No recurring signal reported.</p>
            )}
          </section>
        ))}
      </div>
      <div className="next-test">
        <p className="eyebrow">
          <ArrowRight size={15} aria-hidden /> YOUR NEXT EXPERIMENT
        </p>
        <p>{synthesis.nextTest}</p>
      </div>
      <p className="fine-print">{synthesis.limitations}</p>
      {synthesis.generatedAt && (
        <p className="caption analysis-saved">
          Saved {new Date(synthesis.generatedAt).toLocaleString()} ·{" "}
          {synthesis.model}
        </p>
      )}
    </article>
  );
}
