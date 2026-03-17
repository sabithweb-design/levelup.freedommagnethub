import { redirect } from 'next/navigation';

export default function HomePage() {
  // Since this is a landing page generator for programs, redirect to a default sample
  redirect('/program/nextjs-mastery');
}
