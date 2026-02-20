export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  birth_date?: string;
  death_date?: string;
  father_id?: string;
  mother_id?: string;
  spouse_id?: string;
  photo_url?: string;
  status?: 'pending' | 'approved';
  created_at?: string;
}

export type Gender = 'male' | 'female';
