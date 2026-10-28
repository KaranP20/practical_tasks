// Shapes returned by the mock server. See task-files/API-CONTRACT.md.
// Units are always what the server stores: kilograms and millimetres.

export type Coach = {
  id: string;
  name: string;
  email: string;
  role: string;
  gymName: string;
  clientCount: number;
};

export type LoginResponse = {
  token: string;
  coach: Coach;
};

export type ClientGoal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'recomp';

export type Client = {
  id: string;
  name: string;
  goal: ClientGoal;
  startDateISO: string;
  heightCm: number;
  avatarColor: string;
};

export type WeightEntry = {
  id: string;
  clientId: string;
  dateISO: string;
  weightKg: number;
  note: string | null;
  source: string;
  createdAtISO?: string;
};

export type NewWeightEntry = {
  dateISO: string;
  weightKg: number;
  note: string | null;
};

export type GirthSite = 'waist' | 'chest' | 'hip' | 'arm' | 'thigh';

export type GirthEntry = {
  id: string;
  clientId: string;
  dateISO: string;
  site: GirthSite;
  valueMm: number;
  source: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    field?: string;
  };
};
