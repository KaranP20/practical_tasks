import type { ClientGoal, GirthSite } from '../types/api';

export const GIRTH_SITES: readonly GirthSite[] = [
  'waist',
  'chest',
  'hip',
  'arm',
  'thigh',
];

export const GOAL_LABELS: Record<ClientGoal, string> = {
  fat_loss: 'Fat loss',
  muscle_gain: 'Muscle gain',
  maintenance: 'Maintenance',
  recomp: 'Recomp',
};

// Same limits the server uses, so we can catch them before sending.
export const WEIGHT_MIN_KG = 20;
export const WEIGHT_MAX_KG = 400;
