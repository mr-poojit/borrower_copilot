import { Button } from "../components/ui/Button";
import { demoBorrowers } from "../demo/borrowers";

interface WelcomeProps {
  onStart: () => void;
  onDemo: (id: "priya" | "ravi" | "anita") => void;
}

export function Welcome({ onStart, onDemo }: WelcomeProps) {
  return (
    <div className="page-wide welcome">
      <p className="pill">No login · no bureau pull · nothing stored</p>
      <h1 className="hero">
        Walk into the lender knowing the number you will not cross.
      </h1>
      <p className="lede">
        Four answers before you sign: should you borrow, how much is actually safe, what rate is
        fair, and which EMI to agree to. Then a one-page card you can hold up when they quote 14%.
      </p>
      <Button size="lg" variant="primary" onClick={onStart}>
        Answer a few questions
      </Button>

      <div className="feature-grid">
        <div className="mini-card">
          <strong>Borrow / less / don&apos;t</strong>
          <p>&ldquo;Don&apos;t&rdquo; is a real output. Some profiles should walk away.</p>
        </div>
        <div className="mini-card">
          <strong>Two amount numbers</strong>
          <p>What they may sanction vs what you can carry. Use yours.</p>
        </div>
        <div className="mini-card">
          <strong>Fair rate as a band</strong>
          <p>Plus all-in APR with fee and GST, so quotes compare honestly.</p>
        </div>
      </div>

      <h2 className="h3" style={{ marginTop: "2.5rem" }}>
        The three briefs from the challenge
      </h2>
      <p className="muted">Pre-filled from the assignment. You can still type your own.</p>
      <div className="demo-grid">
        {demoBorrowers.map((d) => (
          <button key={d.id} type="button" className="demo-card" onClick={() => onDemo(d.id)}>
            <span className="demo-name">{d.name}</span>
            <span className="muted">{d.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
