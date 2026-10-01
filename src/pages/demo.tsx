import { useState } from "react";
import { Link } from "react-router-dom";
import { Radio, ArrowUpRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui";
import { demoExperiment, demoFeedback, buildDemoSynthesis } from "../lib/demo";
import { ResultsPanel } from "../components/experiments/ResultsPanel";
import { SynthesisPanel } from "../components/experiments/SynthesisPanel";
export default function Demo() {
  const [selected, setSelected] = useState("");
  const [vote, setVote] = useState("");
  const voted = !!vote && vote === selected;
  const [analysis, setAnalysis] = useState(false);
  const feedback = vote
    ? [
        ...demoFeedback,
        {
          experimentId: "sample",
          variantId: vote,
          reviewerUserId: "you",
          clarityScore: 4,
          reason: "Your illustrative vote",
        },
      ]
    : demoFeedback;
  return (
    <>
      <title>Example experiment · SignalRoom</title>
      <header className="public-nav">
        <Link className="wordmark" to="/">
          <span className="brand-icon">
            <Radio size={22} aria-hidden />
          </span>
          SignalRoom
        </Link>
        <Link className="nav-cta" to="/experiments/new">
          Start a real experiment <ArrowUpRight size={16} aria-hidden />
        </Link>
      </header>
      <main className="workspace demo-workspace">
        <p className="notice">
          Interactive example · Invented feedback. Your choice stays in this
          page and is not saved.
        </p>
        <div className="page-heading demo-heading">
          <div>
            <p className="eyebrow">THE PLAYGROUND / 001</p>
            <h1>{demoExperiment.title}</h1>
            <p>{demoExperiment.audience}</p>
          </div>
          <Button variant="outline" onClick={() => { setSelected(""); setVote(""); }} disabled={!selected && !vote}>
            <RotateCcw size={16} aria-hidden /> Reset demo
          </Button>
        </div>
        <div className="demo-journey" aria-label="Demo steps"><span>01 <b>Compare messages</b></span><span>02 <b>Watch the signal</b></span><span>03 <b>Find your next move</b></span></div>
        <div className="experiment-grid demo-flow">
          <section className="panel">
            <p className="eyebrow">THE QUESTION</p>
            <h2>{demoExperiment.question}</h2>
            <div className="variant-list">
              {demoExperiment.variants.map((v) => (
                <button
                  key={v.id}
                  className={`variant-option ${selected === v.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelected(v.id);

                  }}
                  aria-pressed={selected === v.id}
                >
                  <span className="eyebrow">{v.label}</span>
                  <span className="variant-copy">{v.copy}</span>
                </button>
              ))}
            </div>
            <Button
              disabled={!selected || voted}
              onClick={() => setVote(selected)}
            >
              {voted ? "Example vote counted" : vote ? "Update example vote" : "Try an example vote"}
            </Button>
            <p className="caption demo-vote-status" role="status">{vote ? <><CheckCircle2 size={15} aria-hidden /> Your example vote is included. Choose another message to update it.</> : "Choose a message to see how one vote changes the signal."}</p>
          </section>
          <div className="signal-column">
          <ResultsPanel
            variants={demoExperiment.variants}
            feedback={feedback}
          />
        <section className="panel analysis">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MAKE SENSE OF THE SIGNAL</p>
              <h2>Evidence, then a next step.</h2>
            </div>
            <Button variant="outline" aria-expanded={analysis} onClick={() => setAnalysis(!analysis)}>
              {analysis ? "Hide sample analysis" : "View sample analysis"}
            </Button>
          </div>
          <div className={`analysis-reveal ${analysis ? "is-open" : ""}`} inert={!analysis} aria-hidden={!analysis}>
            <div><SynthesisPanel synthesis={buildDemoSynthesis(feedback)} /></div>
          </div>
        </section>
          </div>
        </div>
      </main>
    </>
  );
}
