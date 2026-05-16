import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BsChatDotsFill } from 'react-icons/bs';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    
    setIsSubmitting(true);
    const success = await register(username, email, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-900 dark:bg-dark-900 px-4 transition-colors relative overflow-hidden">
      {/* Background glowing blobs */}
      <div className="nexus-bg-blob w-[500px] h-[500px] bg-primary-500 top-[-10%] right-[-10%]"></div>
      <div className="nexus-bg-blob w-[600px] h-[600px] bg-accent-500 bottom-[-20%] left-[-10%]"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 my-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-nexus-gradient flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary-500/30 mb-4">
            N
          </div>
          <h1 className="text-3xl font-bold bg-nexus-gradient bg-clip-text text-transparent">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Join Nexus today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-3.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-400"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-3.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-3.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-400"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username || !email || !password}
            className="w-full bg-nexus-gradient text-white font-bold rounded-xl px-4 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-primary-500/25"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
