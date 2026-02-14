import { FamilyMember } from "@/types/family";

export const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    gender: "male",
    birth_date: "1950-01-01",
    created_at: new Date().toISOString(),
    bio: "The patriarch."
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Doe",
    gender: "female",
    birth_date: "1955-05-15",
    spouse_id: "1",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    first_name: "Robert",
    last_name: "Doe",
    gender: "male",
    father_id: "1",
    mother_id: "2",
    birth_date: "1980-08-20",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    first_name: "Alice",
    last_name: "Doe",
    gender: "female",
    father_id: "1",
    mother_id: "2",
    birth_date: "1985-12-10",
    created_at: new Date().toISOString(),
  }
];
