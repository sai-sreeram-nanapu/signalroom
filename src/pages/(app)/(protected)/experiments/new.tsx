import { ExperimentForm } from "../../../../components/experiments/ExperimentForm";
export default function NewExperiment() {
  return (
    <main className="workspace">
      <div className="page-heading">
        <div>
          <p className="eyebrow">NEW EXPERIMENT</p>
          <h1>Create an experiment</h1>
          <p>One audience. One question. A few messages worth comparing.</p>
        </div>
      </div>
      <ExperimentForm />
    </main>
  );
}
