import { signOut } from 'aws-amplify/auth';

export async function logout() {
  await signOut();
  document.cookie = 'accessToken=; Max-Age=0; path=/';
  document.cookie = 'role=; Max-Age=0; path=/';
  window.location.href = '/auth/login';
}
