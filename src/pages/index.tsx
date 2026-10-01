import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  MessageSquare,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { Seo } from "../components/Seo";
import { seo } from "../seo";
import { demoExperiment, demoFeedback } from "../lib/demo";
import { ResultsPanel } from "../components/experiments/ResultsPanel";

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div data-testid="static-landing" className="landing">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="public-nav">
          <Link className="wordmark" to="/">
            <span className="brand-icon">
              <Radio size={22} aria-hidden />
            </span>
            SignalRoom
          </Link>
          <nav aria-label="Main navigation" className="marketing-links">
            <a href="#how-it-works">How it works</a>
            <Link to="/demo">Product demo</Link>
          </nav>
          <Link className="nav-cta" to="/home">
            Open workspace <ArrowUpRight size={16} aria-hidden />
          </Link>
        </header>
        <main id="main-content" className="landing-main">
          <section className="hero">
            <div className="hero-copy">
              <p className="hero-badge">
                <span className="live-dot" /> A little feedback. A better next
                move.
              </p>
              <h1>
                Find the message
                <br /> that <span>makes people care.</span>
              </h1>
              <p className="hero-description">
                Put your ideas in front of real people. Compare messages,
                understand their reactions, and turn feedback into your next
                move.
              </p>
              <div className="cta-row">
                <Link className="button" to="/experiments/new">
                  Create an experiment <ArrowRight size={18} aria-hidden />
                </Link>
                <Link className="button button-secondary" to="/demo">
                  Explore the example <ArrowUpRight size={18} aria-hidden />
                </Link>
              </div>
              <div className="hero-benefits">
                <span>
                  <Check size={15} aria-hidden /> 2–4 message variants
                </span>
                <span>
                  <Check size={15} aria-hidden /> Feedback in realtime
                </span>
                <span>
                  <Check size={15} aria-hidden /> AI that follows the evidence
                </span>
              </div>
            </div>
            <div className="product-preview">
              <div className="preview-toolbar">
                <span className="preview-product">
                  <span className="brand-icon small">
                    <Radio size={16} aria-hidden />
                  </span>
                  SignalRoom <span className="toolbar-divider">/</span> Message
                  experiments
                </span>
                <span className="sample-tag">Illustrative example</span>
              </div>
              <div className="preview-layout">
                <aside className="preview-sidebar">
                  <p className="eyebrow">WORKSPACE</p>
                  <span className="preview-nav active">
                    <FlaskConical size={17} aria-hidden /> Experiments
                  </span>
                  <span className="preview-nav">
                    <MessageSquare size={17} aria-hidden /> Reviewer notes
                  </span>
                  <span className="preview-nav">
                    <Sparkles size={17} aria-hidden /> AI insights
                  </span>
                  <div className="preview-tip">
                    <span className="eyebrow">ONE GOOD QUESTION</span>
                    <p>What would make your audience stop and listen?</p>
                  </div>
                </aside>
                <div className="preview-content">
                  <div className="preview-heading">
                    <div>
                      <span className="status published">
                        Accepting feedback
                      </span>
                      <h2>One product. Two promises.</h2>
                      <p>{demoExperiment.audience}</p>
                    </div>
                    <span className="preview-people">
                      <Users size={18} aria-hidden /> 3 reviewers
                    </span>
                  </div>
                  <div className="preview-body">
                    <div className="preview-messages">
                      <p className="eyebrow">{demoExperiment.question}</p>
                      {demoExperiment.variants.map((v, i) => (
                        <div
                          className={`preview-message variant-tone-${i}`}
                          key={v.id}
                        >
                          <span className="variant-letter">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <div>
                            <span className="caption">
                              {v.label.replace(/^[A-D] · /, "")}
                            </span>
                            <p>{v.copy}</p>
                          </div>
                        </div>
                      ))}
                      <p className="preview-note">
                        <MessageSquare size={15} aria-hidden /> “The deadline
                        makes the outcome feel tangible.”
                        <span>Illustrative reviewer note</span>
                      </p>
                    </div>
                    <ResultsPanel
                      variants={demoExperiment.variants}
                      feedback={demoFeedback}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="how-it-works" className="method">
            <div className="section-intro">
              <p className="eyebrow">LESS GUESSWORK. MORE PROGRESS.</p>
              <h2>
                From “I think” to
                <br />
                “here’s what we learned.”
              </h2>
              <p>
                A focused experiment keeps your next decision grounded in what
                people actually say.
              </p>
            </div>
            <div className="method-cards">
              {[
                {
                  icon: FlaskConical,
                  title: "Set up the comparison.",
                  copy: "Choose an audience, ask one question, and add two to four messages.",
                  n: "01",
                },
                {
                  icon: Users,
                  title: "Make room for feedback.",
                  copy: "Share a link. People choose a message, rate its clarity, and tell you why.",
                  n: "02",
                },
                {
                  icon: Sparkles,
                  title: "Know what to try next.",
                  copy: "Watch results arrive live. Ask AI to find patterns and suggest a next test.",
                  n: "03",
                },
              ].map((item) => (
                <article className="method-card" key={item.n}>
                  <div>
                    <span className="feature-icon">
                      <item.icon size={23} aria-hidden />
                    </span>
                    <span className="step-number">{item.n}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="bottom-cta">
            <div>
              <p className="eyebrow">
                YOUR NEXT IDEA DESERVES A SECOND OPINION
              </p>
              <h2>Start with one good question.</h2>
              <p>
                The people you invite shape the signal. Find out what they
                think.
              </p>
            </div>
            <Link className="button" to="/experiments/new">
              Create an experiment <ArrowRight size={18} aria-hidden />
            </Link>
          </section>
        </main>
        <footer className="public-footer">
          <Link className="wordmark" to="/">
            <Radio size={20} aria-hidden />
            SignalRoom
          </Link>
          <span>Small experiments. Clearer decisions.</span>
          <span>
            Built with DeepSpace <ArrowUpRight size={14} aria-hidden />
          </span>
        </footer>
      </div>
    </>
  );
}
