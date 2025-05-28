'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function cleaningCookiesLogout() {
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (
      cookie.name.startsWith('Cognito') ||
      cookie.name.startsWith('com.amplify')
    )
      cookieStore.delete(cookie.name);
    // if (cookie.name.startsWith('authenticatedCognito'))
    //   cookieStore.set({ name: cookie.name, value: '0' });
  }
  redirect('/auth/signin');
}
