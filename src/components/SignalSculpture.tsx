import {
  ArrowUpRight,
  Check,
  MessageSquare,
  Radio,
  Sparkles,
} from "lucide-react";

/** A lightweight CSS 3D illustration of messages becoming feedback and a next move.
 * Decorative planes keep normal UI interaction and document reading order intact. */
export function SignalSculpture() {
  return (
    <div className="signal-scene" aria-hidden="true">
      <div className="scene-grid" />
      <div className="scene-orbit orbit-one" />
      <div className="scene-orbit orbit-two" />
      <div className="scene-floor" />
      <div className="scene-card scene-card-back">
        <span className="scene-card-label">
          <span>B</span> THE OTHER ANGLE
        </span>
        <strong>
          Less glue code.
          <br />
          More time to build.
        </strong>
        <div className="scene-lines">
          <i />
          <i />
        </div>
      </div>
      <div className="scene-card scene-card-front">
        <span className="scene-card-label">
          <span>A</span> THE FIRST IDEA
        </span>
        <strong>
          Your first multiplayer app.
          <br />
          Live by lunch.
        </strong>
        <div className="scene-feedback">
          <MessageSquare size={15} />
          <span>“That’s an outcome I can picture.”</span>
        </div>
        <div className="scene-card-bottom">
          <span>
            <Check size={13} /> Clearer promise
          </span>
          <ArrowUpRight size={16} />
        </div>
      </div>
      <div className="signal-cube">
        <div className="cube-front">
          <Radio size={42} strokeWidth={1.5} />
        </div>
        <div className="cube-top" />
        <div className="cube-side" />
      </div>
      <div className="scene-insight">
        <span className="scene-spark">
          <Sparkles size={20} />
        </span>
        <div>
          <span>THE NEXT MOVE</span>
          <strong>Lead with the outcome.</strong>
        </div>
      </div>
      <div className="scene-chip">
        <span className="live-dot" /> Ideas in. Clarity out.
      </div>
    </div>
  );
}
