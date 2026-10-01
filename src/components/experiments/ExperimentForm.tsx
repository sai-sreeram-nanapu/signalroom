import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useR2Files, useMutations } from "deepspace";
import { Plus, X, ArrowRight, Upload, CheckCircle2 } from "lucide-react";
import { Button, Input, Textarea, Label, useToast } from "../ui";
import { runAction } from "../../lib/actions";
import type { Experiment } from "../../lib/signalroom";
export function ExperimentForm({
  initial,
  experimentId,
}: {
  initial?: Experiment;
  experimentId?: string;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [audience, setAudience] = useState(initial?.audience || "");
  const [question, setQuestion] = useState(initial?.question || "");
  const [variants, setVariants] = useState(
    initial?.variants.map((v) => ({ label: v.label, copy: v.copy })) || [
      { label: "A", copy: "" },
      { label: "B", copy: "" },
    ],
  );
  const [assetKey, setAssetKey] = useState(initial?.assetKey || "");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const { upload, getUrl, isUploading } = useR2Files({ scope: "app" });
  const { ready } = useMutations("experiments");
  const toast = useToast();
  const navigate = useNavigate();
  async function save(event: FormEvent) {
    event.preventDefault();
    setFailure("");
    setBusy(true);
    try {
      const { recordId } = await runAction("saveExperiment", {
        title,
        audience,
        question,
        variants,
        assetKey,
        experimentId,
      });
      toast.success(
        "Draft saved",
        "Review your messages, then publish when ready.",
      );
      navigate(`/experiments/${recordId}`);
    } catch (e) {
      setFailure(
        e instanceof Error ? e.message : "Could not save the experiment",
      );
      toast.error("Draft not saved");
    } finally {
      setBusy(false);
    }
  }
  async function uploadFile(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setFailure("Choose a PNG, JPEG, or WebP image smaller than 5 MB.");
      return;
    }
    setFailure("");
    try {
      const result = await upload(file, file.name, {
        key: `creatives/${crypto.randomUUID()}.${file.type.split("/")[1]}`,
      });
      if (!result.success || !result.key)
        throw new Error(result.error || "Upload failed");
      setAssetKey(result.key);
      toast.success("Creative uploaded");
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Upload failed");
      toast.error("Creative not uploaded");
    }
  }
  return (
    <form onSubmit={save} className="form-grid">
      <div>
        <section className="panel form-section editor-details">
          <p className="eyebrow">
            <span className="form-step">1</span> EXPERIMENT DETAILS
          </p>
          <h2>What do you want to learn?</h2>
          <div className="field" style={{ marginTop: 24 }}>
            <Label htmlFor="title">Experiment title</Label>
            <Input
              id="title"
              required
              minLength={3}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A clearer promise for our landing page"
            />
          </div>
          <div className="field">
            <Label htmlFor="audience">Who is this message for?</Label>
            <Input
              id="audience"
              required
              minLength={3}
              maxLength={300}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Developers building their first AI app"
            />
          </div>
          <div className="field">
            <Label htmlFor="question">Your question for reviewers</Label>
            <Input
              id="question"
              required
              minLength={3}
              maxLength={300}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Which message would make you try this product?"
            />
          </div>
        </section>
        <section className="panel form-section editor-variants">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="form-step">2</span> MESSAGE VARIANTS
              </p>
              <h2>What should people compare?</h2>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={variants.length >= 4}
              onClick={() =>
                setVariants([
                  ...variants,
                  {
                    label: String.fromCharCode(65 + variants.length),
                    copy: "",
                  },
                ])
              }
            >
              <Plus size={14} /> Add variant
            </Button>
          </div>
          <div className="variant-editors-grid">
          {variants.map((v, i) => (
            <div className="variant-editor" key={i}>
              <div className="section-heading">
                <span className="mono">VARIANT {i + 1}</span>
                {variants.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove variant ${i + 1}`}
                    onClick={() =>
                      setVariants(variants.filter((_, j) => j !== i))
                    }
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
              <div className="field">
                <Label htmlFor={`label-${i}`}>Variant {i + 1} label</Label>
                <Input
                  id={`label-${i}`}
                  required
                  maxLength={40}
                  value={v.label}
                  onChange={(e) =>
                    setVariants(
                      variants.map((item, j) =>
                        j === i ? { ...item, label: e.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="field">
                <Label htmlFor={`copy-${i}`}>Variant {i + 1} message</Label>
                <Textarea
                  id={`copy-${i}`}
                  required
                  minLength={3}
                  maxLength={800}
                  rows={3}
                  value={v.copy}
                  onChange={(e) =>
                    setVariants(
                      variants.map((item, j) =>
                        j === i ? { ...item, copy: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Write the exact copy you want people to compare."
                />
              </div>
            </div>
          ))}
          </div>
        </section>
        <section className="panel">
          <p className="eyebrow">
            <span className="form-step">3</span> OPTIONAL CREATIVE
          </p>
          <h2>Add a creative.</h2>
          <p className="caption" style={{ margin: "12px 0" }}>
            PNG, JPEG, or WebP · Up to 5 MB. Uploaded images are publicly
            accessible, including while this experiment is a draft. Use only
            material you intend to share.
          </p>
          <div className="upload-zone">
            <Upload size={24} aria-hidden />
            <p>Give reviewers a little more context.</p>
            <Input
              type="file"
              aria-label="Experiment creative"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploading || busy}
              onChange={(e) => void uploadFile(e.target.files?.[0])}
            />
          </div>
          {isUploading && <p role="status">Uploading creative…</p>}
          {assetKey && (
            <>
              <img
                className="creative"
                src={getUrl(assetKey)}
                alt="Creative attached to this experiment"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAssetKey("")}
              >
                Remove from experiment
              </Button>
            </>
          )}
        </section>
        {failure && (
          <div className="error-message" role="alert">
            {failure}
          </div>
        )}
        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate(experimentId ? `/experiments/${experimentId}` : "/home")
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!ready || busy || isUploading}
            loading={busy}
          >
            Save draft <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      <aside className="form-note">
        <p className="eyebrow">
          <CheckCircle2 size={15} aria-hidden /> EXPERIMENT CHECKLIST
        </p>
        <div className="form-progress">
          <span
            className={
              title.trim().length >= 3 &&
              audience.trim().length >= 3 &&
              question.trim().length >= 3
                ? "complete"
                : ""
            }
          />
          <span
            className={
              variants.every((v) => v.copy.trim().length >= 3) ? "complete" : ""
            }
          />
        </div>
        <h2>A good question beats a big survey.</h2>
        <p>
          A focused comparison is easier to interpret. Keep the audience and
          question constant, and give each message a distinct idea.
        </p>
        <p style={{ marginTop: 20 }}>
          Your draft is private. Publishing makes the experiment visible to
          anyone with the link. Reviewers sign in to submit one response.
        </p>
        <div className="form-preview">
          <p className="eyebrow">YOUR EXPERIMENT</p>
          <strong>{title || "Untitled experiment"}</strong>
          <p>{audience || "Choose your audience"}</p>
          <p>{variants.length} message variants · Private draft</p>
        </div>
      </aside>
    </form>
  );
}
