import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { Seo } from "../components/Seo";
import { seo } from "../seo";
import { demoExperiment, demoFeedback } from "../lib/demo";
import { SignalSculpture } from "../components/SignalSculpture";
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
          <section className="hero studio-hero">
            <div className="hero-top">
              <div className="hero-copy">
                <p className="hero-badge">
                  <span className="live-dot" /> A little feedback. A better next
                  move.
                </p>
                <h1>
                  Find the message that <span>makes people care.</span>
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
              <SignalSculpture />
            </div>

          </section>
          <section className="product-story" aria-label="Illustrative experiment">
            <div className="story-copy">
              <p className="eyebrow">FROM REACTION TO DIRECTION</p>
              <h2>A decision you can explain.</h2>
              <p>See which message people choose, understand why, and decide what to test next. The feedback stays connected to the question.</p>
              <Link className="text-link" to="/demo">Try this comparison <ArrowUpRight size={17} aria-hidden /></Link>
              <div className="story-messages">
                <span className="sample-tag">Illustrative example · 3 invented responses</span>
                {demoExperiment.variants.map((variant, i) => <div className={`story-message variant-tone-${i}`} key={variant.id}><span className="variant-letter">{String.fromCharCode(65+i)}</span><div><p className="caption">{variant.label.replace(/^[A-D] · /, "")}</p><p>{variant.copy}</p></div></div>)}
              </div>
            </div>
            <ResultsPanel variants={demoExperiment.variants} feedback={demoFeedback} />
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
