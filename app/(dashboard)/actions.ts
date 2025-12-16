'use server';

import { deleteProductById } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { seedDatabases as seedDatabasesUnified } from '@/lib/seed';

export async function deleteProduct(formData: FormData) {
  // let id = Number(formData.get('id'));
  // await deleteProductById(id);
  // revalidatePath('/');
}

export async function seedDatabases(formData: FormData) {
  const eventCount = Number(formData.get('eventCount') || '500');

  const result = await seedDatabasesUnified({ eventCount });

  // Revalidate paths after seeding
  revalidatePath('/');
  revalidatePath('/analytics');
  revalidatePath('/products');

  return result;
}
