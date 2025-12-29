import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login({ email, password });
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center px-4 py-16 max-w">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-auto space-y-8"
            >
                <div className="text-center ">
      
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        Welcome Back
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Sign in to your account to continue
                    </p>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-5"
                >
                    <div >
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /> */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=" w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="  you@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                  
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ">
                            Password
                        </label>
                        <div className="relative">
                            {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /> */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className=" w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="  ••••••••"
                                disabled={loading}
                            />
                        </div>
                    </div>

                
                    <motion.button
                        type="submit"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        disabled={loading}
                        className="w-full mt-6 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2 ">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
}
