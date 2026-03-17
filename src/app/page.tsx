
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Defaulting to the primary program ID. 
  // In a multi-program app, this could be a directory or a featured program.
  redirect('/program/nextjs-mastery');
}
