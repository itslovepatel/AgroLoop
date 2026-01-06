import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Building2, Tractor, ArrowRight, Check, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';
import { UserType, Farmer, Buyer } from '../types';
import { BUYER_TYPES } from '../constants';
import { supabase, signUp, signIn, resetPassword } from '../lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'login' | 'register' | 'forgot' | 'userType' | 'details';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useApp();
    const [step, setStep] = useState<Step>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [userType, setUserType] = useState<UserType.FARMER | UserType.BUYER | null>(null);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('bioenergy');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // User already logged in
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    const user = profile.role === 'farmer' ? {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone || '',
                        type: UserType.FARMER,
                        location: profile.location || '',
                        district: profile.district || '',
                        state: profile.state || '',
                        totalEarnings: profile.total_earnings,
                        totalListings: profile.total_listings,
                        greenCertified: profile.is_verified,
                        createdAt: profile.created_at,
                    } as Farmer : {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone || '',
                        type: UserType.BUYER,
                        companyName: profile.company_name || '',
                        companyType: (profile.company_type || 'bioenergy') as Buyer['companyType'],
                        totalPurchases: profile.total_purchases,
                        activeContracts: 0,
                        createdAt: profile.created_at,
                    } as Buyer;

                    login(user);
                    onClose();
                }
            }
        };

        if (isOpen) {
            checkSession();
        }
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const { data, error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Fetch profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError || !profile) {
                setError('Profile not found. Please contact support.');
                setIsLoading(false);
                return;
            }

            const user = profile.role === 'farmer' ? {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone || '',
                type: UserType.FARMER,
                location: profile.location || '',
                district: profile.district || '',
                state: profile.state || '',
                totalEarnings: profile.total_earnings,
                totalListings: profile.total_listings,
                greenCertified: profile.is_verified,
                createdAt: profile.created_at,
            } as Farmer : {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phone || '',
                type: UserType.BUYER,
                companyName: profile.company_name || '',
                companyType: (profile.company_type || 'bioenergy') as Buyer['companyType'],
                totalPurchases: profile.total_purchases,
                activeContracts: 0,
                createdAt: profile.created_at,
            } as Buyer;

            login(user);
            setIsLoading(false);
            onClose();
            resetForm();
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Move to user type selection
        setStep('userType');
    };

    const handleUserTypeSelect = (type: UserType.FARMER | UserType.BUYER) => {
        setUserType(type);
        setStep('details');
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const role = userType === UserType.FARMER ? 'farmer' : 'buyer';

        const { data, error: authError } = await signUp(email, password, {
            name,
            role,
            location: userType === UserType.FARMER ? location : undefined,
            company_name: userType === UserType.BUYER ? companyName : undefined,
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Create user object for local state
            const baseUser = {
                id: data.user.id,
                name,
                email,
                phone: '',
                createdAt: new Date().toISOString(),
            };

            if (userType === UserType.FARMER) {
                const farmer: Farmer = {
                    ...baseUser,
                    type: UserType.FARMER,
                    location,
                    district: location.split(',')[0]?.trim() || location,
                    state: location.split(',')[1]?.trim() || 'Punjab',
                    totalEarnings: 0,
                    totalListings: 0,
                    greenCertified: false,
                };
                login(farmer);
            } else {
                const buyer: Buyer = {
                    ...baseUser,
                    type: UserType.BUYER,
                    companyName,
                    companyType: companyType as Buyer['companyType'],
                    totalPurchases: 0,
                    activeContracts: 0,
                };
                login(buyer);
            }

            setIsLoading(false);
            onClose();
            resetForm();
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        const { error: resetError } = await resetPassword(email);

        if (resetError) {
            setError(resetError.message);
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setResetSent(true);
    };

    const resetForm = () => {
        setStep('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setUserType(null);
        setName('');
        setLocation('');
        setCompanyName('');
        setError('');
        setResetSent(false);
    };

    const renderStep = () => {
        switch (step) {
            case 'login':
                return (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="text-nature-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900">Welcome Back</h3>
                            <p className="text-earth-500 mt-1">Sign in to your AgriLoop account</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-earth-300 text-nature-600 focus:ring-nature-500"
                                />
                                <span className="text-sm text-earth-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setStep('forgot')}
                                className="text-sm text-nature-600 hover:underline font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!email || !password || isLoading}
                            className="w-full bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-earth-500">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setStep('register')}
                                className="text-nature-600 font-medium hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    </form>
                );

            case 'register':
                return (
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="text-nature-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900">Create Account</h3>
                            <p className="text-earth-500 mt-1">Join AgriLoop today</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password (min 6 chars)"
                                    className="w-full pl-10 pr-12 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!email || !password || !confirmPassword || isLoading}
                            className="w-full bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            Continue <ArrowRight size={18} />
                        </button>

                        <p className="text-center text-sm text-earth-500">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setStep('login')}
                                className="text-nature-600 font-medium hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                );

            case 'forgot':
                if (resetSent) {
                    return (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Check className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900">Check Your Email</h3>
                            <p className="text-earth-500">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <button
                                onClick={() => {
                                    setResetSent(false);
                                    setStep('login');
                                }}
                                className="text-nature-600 font-medium hover:underline"
                            >
                                Back to sign in
                            </button>
                        </div>
                    );
                }

                return (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="text-amber-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900">Reset Password</h3>
                            <p className="text-earth-500 mt-1">Enter your email to receive reset instructions</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!email || isLoading}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-earth-300 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-earth-500">
                            <button
                                type="button"
                                onClick={() => setStep('login')}
                                className="text-nature-600 font-medium hover:underline"
                            >
                                Back to sign in
                            </button>
                        </p>
                    </form>
                );

            case 'userType':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-earth-900">I am a...</h3>
                            <p className="text-earth-500 mt-1">Select how you'll use AgriLoop</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleUserTypeSelect(UserType.FARMER)}
                                className="group p-6 border-2 border-earth-200 rounded-xl hover:border-nature-500 hover:bg-nature-50 transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-nature-100 group-hover:bg-nature-200 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                                    <Tractor className="text-nature-700" size={32} />
                                </div>
                                <h4 className="font-bold text-earth-900">Farmer</h4>
                                <p className="text-sm text-earth-500 mt-1">Sell crop residue</p>
                            </button>

                            <button
                                onClick={() => handleUserTypeSelect(UserType.BUYER)}
                                className="group p-6 border-2 border-earth-200 rounded-xl hover:border-nature-500 hover:bg-nature-50 transition-all text-center"
                            >
                                <div className="w-16 h-16 bg-nature-100 group-hover:bg-nature-200 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                                    <Building2 className="text-nature-700" size={32} />
                                </div>
                                <h4 className="font-bold text-earth-900">Buyer</h4>
                                <p className="text-sm text-earth-500 mt-1">Purchase biomass</p>
                            </button>
                        </div>
                    </div>
                );

            case 'details':
                return (
                    <form onSubmit={handleDetailsSubmit} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="text-nature-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-earth-900">Complete Your Profile</h3>
                            <p className="text-earth-500 mt-1">
                                {userType === UserType.FARMER ? 'Tell us about your farm' : 'Tell us about your company'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                required
                            />
                        </div>

                        {userType === UserType.FARMER ? (
                            <div>
                                <label className="block text-sm font-medium text-earth-700 mb-2">
                                    Location (District, State)
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Ludhiana, Punjab"
                                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter company name"
                                        className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-2">
                                        Company Type
                                    </label>
                                    <select
                                        value={companyType}
                                        onChange={(e) => setCompanyType(e.target.value)}
                                        className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-nature-500"
                                    >
                                        {BUYER_TYPES.map(bt => (
                                            <option key={bt.id} value={bt.id}>{bt.icon} {bt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={!name || (userType === UserType.FARMER ? !location : !companyName) || isLoading}
                            className="w-full bg-nature-600 hover:bg-nature-700 disabled:bg-earth-300 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            {renderStep()}
        </Modal>
    );
};

export default AuthModal;
