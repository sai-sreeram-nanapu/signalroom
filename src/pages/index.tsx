/* Design direction: SignalRoom helps builders test messaging with invited reviewers.
   Emotion: the relief of seeing a hypothesis meet evidence. Metaphor: an editorial
   research notebook on a warm desk. References: field notebooks, newspaper margins,
   a radio's signal meter. Memorably useful: the vote-and-reason loop is the hero.
   Not: a campaign suite, a generic chatbot, or a neon analytics dashboard. */
import { Link } from 'react-router-dom'
import { ArrowUpRight, Radio } from 'lucide-react'
import { Seo } from '../components/Seo'
import { seo } from '../seo'
import { demoExperiment, demoFeedback } from '../lib/demo'
import { ResultsPanel } from '../components/experiments/ResultsPanel'
export default function Landing() {
  return <><Seo {...seo} path="/" /><div data-testid="static-landing" className="landing">
    <header className="public-nav"><Link className="wordmark" to="/"><Radio size={23} />SignalRoom<span className="brand-dot" /></Link><Link to="/home">Open workspace <ArrowUpRight size={16} /></Link></header>
    <main className="landing-main"><section className="hero"><div className="hero-copy"><p className="eyebrow">A SMALL ROOM FOR BETTER MESSAGING</p><h1>Less guessing.<br /><em>More signal.</em></h1><p className="hero-description">Put your message in front of real people. Compare their choices, hear their reasons, and decide what to test next.</p><div className="cta-row"><Link className="button" to="/experiments/new">Create an experiment <ArrowUpRight size={17} /></Link><Link className="text-link" to="/demo">Explore the example</Link></div><p className="caption">Two messages. One question. Feedback that moves you forward.</p></div>
    <div className="hero-preview"><div className="preview-top"><span className="mono">FIELD NOTES / 001</span><span className="sample-tag">Illustrative example</span></div><div className="preview-question"><p className="eyebrow">{demoExperiment.audience}</p><h2>{demoExperiment.question}</h2></div><div className="preview-variants">{demoExperiment.variants.map(v => <div key={v.id}><p className="eyebrow">{v.label}</p><p>{v.copy}</p></div>)}</div><ResultsPanel variants={demoExperiment.variants} feedback={demoFeedback} /></div></section>
    <section className="method"><p className="eyebrow">FROM HUNCH TO NEXT TEST</p><div className="method-row"><span className="mono">01</span><h2>Frame the question.</h2><p>Choose an audience and compare two to four messages. Keep the test focused.</p></div><div className="method-row"><span className="mono">02</span><h2>Invite a point of view.</h2><p>Share a link. Reviewers pick a message, rate its clarity, and tell you why.</p></div><div className="method-row"><span className="mono">03</span><h2>Follow the evidence.</h2><p>Watch results arrive live, then ask AI to find patterns, disagreements, and the next experiment.</p></div></section></main>
    <footer className="public-footer"><span>SignalRoom · Built for the next iteration.</span><span>Powered by DeepSpace</span></footer>
  </div></>
}
