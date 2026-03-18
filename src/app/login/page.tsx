'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2, AlertCircle, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const ensureAdminRecord = async (uid: string) => {
    try {
      await setDoc(doc(db, 'roles_admin', uid), {
        role: 'admin',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error("Failed to create admin record:", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await ensureAdminRecord(credential.user.uid);
      toast({ title: "Welcome back!", description: "Successfully authenticated as admin." });
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!email || !password) {
      setError("Please enter an email and password to initialize.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await ensureAdminRecord(credential.user.uid);
      toast({ title: "Admin Account Created", description: "Successfully initialized and logged in." });
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="justify-center flex mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <ShieldCheck className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-headline font-black text-primary uppercase tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.2em]">Freedom Magnet Hub Secure Access</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="font-headline font-bold text-xl uppercase">Secure Login</CardTitle>
            <CardDescription className="text-white/70">Enter your credentials to manage program content.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="p-8 space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Issue</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Admin Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/95 shadow-xl shadow-primary/20 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2"><LogIn className="w-5 h-5" /> LOGIN</span>
                )}
              </Button>

              <Button 
                type="button"
                variant="ghost"
                onClick={handleInitialize}
                className="w-full text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                disabled={isLoading}
              >
                Need to initialize first-time access? Click here.
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Freedom Magnet Infrastructure
        </p>
      </div>
    </div>
  );
}