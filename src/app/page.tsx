import { redirect } from 'next/navigation';

export default function HomePage() {
  // Automatically guide the visitor to our flagship program landing page
  redirect('/program/nextjs-mastery');
}
