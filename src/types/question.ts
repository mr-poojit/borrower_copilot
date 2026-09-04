export type QuestionType =
    | "text"
    | "number"
    | "currency"
    | "select"
    | "boolean";

export interface QuestionOption {
    label: string;
    value: string | number | boolean;
}

export interface Question {
    id: string;

    type: QuestionType;

    title: string;
    description?: string;

    required: boolean;

    options?: QuestionOption[];

    field: string;

    showWhen?: (
        answers: Record<string, unknown>
    ) => boolean;

    why?: string;
}
