export interface Offer {
  id: string;
  price_ht?: number | string;
  is_active?: boolean;
  display_order?: number;

  title_fr?: string;
  title_en?: string;
  short_fr?: string;
  short_en?: string;
  long_fr?: string;
  long_en?: string;
}

export interface Team {
  id?: string;
  firstname?: string;
  lastname?: string;
  bio_fr?: string;
  bio_en?: string;
  avatar_url?: string;
}

export interface Details {
  slug?: string;
  "notre-travail"?: string;
}

export interface Step {
  id?: string;
  is_active?: boolean;
  step_number?: number;
}
