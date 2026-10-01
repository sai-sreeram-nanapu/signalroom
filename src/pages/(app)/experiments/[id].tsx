import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth, useQuery, useMutations, useR2Files } from "deepspace";
import { ArrowLeft, Copy, Sparkles, MessageSquare } from "lucide-react";
import { Button, useToast } from "../../../components/ui";
import { ResultsPanel } from "../../../components/experiments/ResultsPanel";
import { ReviewerForm } from "../../../components/experiments/ReviewerForm";
import { SynthesisPanel } from "../../../components/experiments/SynthesisPanel";
import { runAction } from "../../../lib/actions";
import type { Experiment, Feedback, Synthesis } from "../../../lib/signalroom";
export default function ExperimentPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const { records, status, error } = useQuery<Experiment>("experiments", {
    where: { recordId: id || "" },
  });
  const { records: responses, status: feedbackStatus } = useQuery<Feedback>(
    "responses",
    {
      where: { experimentId: id || "" },
      orderBy: "createdAt",
      orderDir: "desc",
    },
  );
  const { records: syntheses } = useQuery<Synthesis>("syntheses", {
    where: { experimentId: id || "" },
    orderBy: "createdAt",
    orderDir: "desc",
  });
  const { ready } = useMutations("experiments");
  const { getUrl } = useR2Files({ scope: "app" });
  const [busy, setBusy] = useState("");
  const [failure, setFailure] = useState("");
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const record = records[0];
  const experiment = record?.data;
  const owner = experiment?.creatorId === userId;
  async function changeStatus(next: string) {
    setBusy(next);
    setFailure("");
    try {
      await runAction("setExperimentStatus", {
        experimentId: id,
        status: next,
      });
      toast.success(
        next === "published" ? "Experiment published" : "Experiment closed",
      );
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Status change failed");
      toast.error("Could not change status");
    } finally {
      setBusy("");
    }
  }
  async function analyze() {
    setBusy("analysis");
    setFailure("");
    try {
      await runAction("synthesizeExperiment", { experimentId: id });
      toast.success("Analysis saved");
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Analysis failed");
      toast.error("Analysis not completed");
    } finally {
      setBusy("");
    }
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/experiments/${id}`,
      );
      setCopied(true);
      toast.success("Share link copied");
    } catch {
      setFailure("Copy the URL in your address bar to share this experiment.");
    }
  }
  if (status === "loading")
    return (
      <div className="workspace">
        <div className="busy-panel" aria-busy="true">
          Loading experiment…
        </div>
      </div>
    );
  if (status === "error")
    return (
      <div className="route-state" role="alert">
        <h1>Could not connect.</h1>
        <p>{String(error)}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  if (!experiment)
    return (
      <div className="route-state">
        <h1>This experiment isn’t available.</h1>
        <p>
          The link may be incorrect, or the experiment may still be a private
          draft. Sign in if you created it.
        </p>
        <Link className="text-link" to="/home">
          Back to workspace
        </Link>
      </div>
    );
  const feedback = responses.map((r) => r.data);
  return (
    <main className="workspace">
      <Link
        className="caption"
        to="/home"
        style={{ display: "inline-flex", gap: 7, alignItems: "center" }}
      >
        <ArrowLeft size={14} aria-hidden /> Experiments
      </Link>
      <div className="page-heading">
        <div>
          <span className={`status ${experiment.status}`}>
            {experiment.status}
          </span>
          <h1>{experiment.title}</h1>
          <p>{experiment.audience}</p>
        </div>
        <div className="page-heading-actions">
          {owner && experiment.status === "draft" && (
            <>
              <Link className="text-link" to={`/experiments/${id}/edit`}>
                Edit draft
              </Link>
              <Button
                disabled={!ready || !!busy}
                loading={busy === "published"}
                onClick={() => void changeStatus("published")}
              >
                Publish experiment
              </Button>
            </>
          )}
          {experiment.visibility === "public" && (
            <Button variant="outline" onClick={() => void copyLink()}>
              <Copy size={14} aria-hidden />
              {copied ? "Link copied" : "Copy share link"}
            </Button>
          )}
          {owner && experiment.status === "published" && (
            <Button
              variant="ghost"
              disabled={!!busy}
              onClick={() => void changeStatus("closed")}
            >
              Close experiment
            </Button>
          )}
        </div>
      </div>
      {experiment.status === "draft" && (
        <p className="notice" style={{ marginBottom: 22 }}>
          Private draft · Review the messages below. Publishing makes this
          experiment accessible by link and locks its message copy.
        </p>
      )}
      {failure && (
        <div className="error-message" role="alert">
          {failure}
        </div>
      )}
      {experiment.assetKey && (
        <img
          className="creative"
          src={getUrl(experiment.assetKey)}
          alt="Creative supplied by the experiment creator"
        />
      )}
      <div className="experiment-grid">
        {owner || experiment.status === "draft" ? (
          <section className="panel">
            <p className="eyebrow">THE QUESTION</p>
            <h2>{experiment.question}</h2>
            <div className="variant-list">
              {experiment.variants.map((v) => (
                <div className="variant-static" key={v.id}>
                  <p className="eyebrow">{v.label}</p>
                  <p>{v.copy}</p>
                </div>
              ))}
            </div>
            <p className="caption">
              Share the published link with people in your target audience. Each
              signed-in reviewer can submit one response.
            </p>
          </section>
        ) : (
          <ReviewerForm
            experiment={experiment}
            experimentId={record.recordId}
          />
        )}
        {owner ? (
          feedbackStatus === "error" ? (
            <p className="error-message" role="alert">
              Could not load feedback. Reload to retry.
            </p>
          ) : feedbackStatus === "loading" ? (
            <div className="busy-panel" aria-busy="true">
              Connecting to live feedback…
            </div>
          ) : (
            <ResultsPanel variants={experiment.variants} feedback={feedback} />
          )
        ) : (
          <aside className="form-note">
            <p className="eyebrow">AN INDEPENDENT POINT OF VIEW</p>
            <h2>Go with what resonates.</h2>
            <p>
              There is no correct answer. Choose the message that works for you,
              then explain why. Specific reactions are more useful than a score
              alone.
            </p>
          </aside>
        )}
      </div>
      {owner && (
        <>
          <section className="panel analysis">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <Sparkles size={14} aria-hidden /> AI INSIGHTS
                </p>
                <h2>Evidence, then a next step.</h2>
              </div>
              <Button
                variant="outline"
                disabled={
                  !ready ||
                  !!busy ||
                  !feedback.length ||
                  experiment.status === "draft" ||
                  feedbackStatus !== "ready"
                }
                loading={busy === "analysis"}
                onClick={() => void analyze()}
              >
                <Sparkles size={15} aria-hidden />
                {syntheses.length ? "Refresh analysis" : "Analyze feedback"}
              </Button>
            </div>
            {syntheses[0] ? (
              <>
                {syntheses[0].data.responseCount !== feedback.length && (
                  <p className="notice" style={{ marginBottom: 20 }}>
                    New feedback has arrived since this analysis. Refresh it to
                    include the latest responses.
                  </p>
                )}
                <SynthesisPanel synthesis={syntheses[0].data} />
                <p className="caption" style={{ marginTop: 14 }}>
                  Refreshing analysis uses your DeepSpace AI credits.
                </p>
              </>
            ) : (
              <p className="caption">
                Collect feedback first. Analysis uses this experiment’s
                responses and your DeepSpace AI credits. It is saved for you.
                Small samples remain directional.
              </p>
            )}
          </section>
          <section className="panel analysis">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <MessageSquare size={14} aria-hidden /> QUALITATIVE FEEDBACK
                </p>
                <h2>Reviewer notes</h2>
              </div>
            </div>
            {!feedback.length ? (
              <p className="caption">
                Reviewer reasons will appear here as feedback arrives.
              </p>
            ) : (
              feedback.map((f, i) => (
                <article className="feedback-item" key={responses[i].recordId}>
                  <div className="feedback-header">
                    <span className="mono">
                      {experiment.variants.find((v) => v.id === f.variantId)
                        ?.label || "Unknown variant"}
                    </span>
                    <span className="caption">
                      Clarity {f.clarityScore} / 5
                    </span>
                  </div>
                  <blockquote>{f.reason}</blockquote>
                </article>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}
