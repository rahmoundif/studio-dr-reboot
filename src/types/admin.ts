export interface Profile {
  id: string;
  firstname: string | null;
  lastname: string | null;
  bio_fr: string;
  bio_en: string;
  avatar_url: string | null;
}

export interface Section {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  body_fr: string;
  body_en: string;
}
