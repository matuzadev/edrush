'use client';

import { useState, FormEvent, useMemo, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getGoogleSignInErrorMessage, startGoogleSignIn } from '@/lib/google-sign-in';
import { Zap, User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, Gift, BookOpen, BarChart2, Target, AtSign, Calendar, MapPin, XCircle } from 'lucide-react';