import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, ArrowLeft } from "lucide-react";

interface LoginProps {
  onLogin: (password: string) => void;
  onBack?: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const correctPassword = "9104";
    
    if (password === correctPassword) {
      onLogin(password);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 dark:bg-slate-900">
      {onBack && (
        <div className="w-full max-w-md mb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to site
          </Button>
        </div>
      )}
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 dark:bg-slate-950">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900 mb-2 dark:text-slate-100">Admin Login</h1>
          <p className="text-slate-600 text-center dark:text-slate-300">
            Enter your password to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2"
                autoFocus
              />
              {error && (
                <p className="text-red-600 mt-2">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>

      </Card>
    </div>
  );
}
