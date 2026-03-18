'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-headline font-black text-primary uppercase tracking-tight">Admin Access</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">Freedom Magnet Hub Secure Portal</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="font-headline font-bold text-xl uppercase">Login Required</CardTitle>
            <CardDescription className="text-white/70">Enter your administrative credentials to continue.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="p-8 space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Administrative Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secret Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 focus:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/95 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  'ENTER CONSOLE'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Secure Freedom Infrastructure
        </p>
      </div>
    </div>
  );
}
