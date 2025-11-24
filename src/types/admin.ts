export interface Profile {
  id: string;
  firstname: string | null;
  lastname: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  is_public: boolean;
  is_approved: boolean;
  pseudo: string | null;
}

export interface Section {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  body_fr: string;
  body_en: string;
}
