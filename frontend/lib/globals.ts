export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export interface Portion {
  id: number;
  name: string;
  description: string;
}

export interface Criteria {
  id: number;
  name: string;
  weight: number;
  portionId: number;
}

export interface Criterion {
  id: number;
  description: string;
  weight: number;
  criteriaId: number;
}

export interface Score {
  id: number;
  value: number;
  userId: number;
  teamId: number;
}
