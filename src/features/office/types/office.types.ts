export interface Office {
  id: string;
  office_name: string;
  description: string | null;
  is_active: boolean;
  access_link: string;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOfficePayload {
  office_name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateOfficePayload {
  office_name?: string;
  description?: string;
  is_active?: boolean;
}
