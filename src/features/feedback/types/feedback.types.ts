import type { Office } from "@/features/office/types/office.types";
import type { Student } from "@/types/student.types";

export type Feedback = {
  id: string;
  raw_text: string | null;
  status: "pending" | "processed";
  is_anonymous: boolean;
  is_summarized: boolean;
  office: Office;
  student: Student;
  created_at: string;
  updated_at: string;
};

export interface FeedbackParams {
  page?: number;
  per_page?: number;
  status?: string;
}
