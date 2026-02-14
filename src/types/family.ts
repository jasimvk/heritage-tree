export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  death_date?: string;
  gender: Gender;
  bio?: string;
  avatar_url?: string;
  father_id?: string;
  mother_id?: string;
  spouse_id?: string;
  created_at: string;
}

export interface TreeData {
  members: FamilyMember[];
}
