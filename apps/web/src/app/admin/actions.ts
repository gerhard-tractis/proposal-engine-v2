'use server';

import { getAllProposals } from '@/lib/proposal-helpers';
import type { Proposal } from '@repo/shared';

export async function getProposals(): Promise<Proposal[]> {
  return getAllProposals();
}
