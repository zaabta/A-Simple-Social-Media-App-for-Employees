import { PAGE_PATH } from '@/constants';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(PAGE_PATH.USERS);
}