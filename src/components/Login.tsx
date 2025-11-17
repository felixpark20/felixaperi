import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock } from "lucide-react";

interface LoginProps {
  onLogin: (password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // You can change this password to whatever you want
    const correctPassword = "admin123";
    
    if (password === correctPassword) {
      onLogin(password);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-600 text-center">
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

        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <p className="text-slate-600">
            <strong>Default password:</strong> admin123
          </p>
          <p className="text-slate-500 mt-2">
            You can change this in the Login.tsx component
          </p>
        </div>
      </Card>
    </div>
  );
}
