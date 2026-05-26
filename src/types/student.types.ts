export interface Student {
  id: string;
  google_id: string | null;
  name: string;
  email: string;
  profile_picture: string | null;
  google_token?: string;
  google_refresh_token?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
