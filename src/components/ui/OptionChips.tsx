import { QuestionOption } from "../../types";

interface OptionChipsProps {
  options: QuestionOption[];
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}

export function OptionChips({ options, value, onChange }: OptionChipsProps) {
  return (
    <div className="chip-grid">
      {options.map((opt) => {
        const selected = String(value) === String(opt.value);
        return (
          <button
            key={String(opt.value)}
            type="button"
            className={selected ? "chip chip-selected" : "chip"}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
