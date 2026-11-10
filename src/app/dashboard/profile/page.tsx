'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usUserProfile } from '@/hooks/useProfile';
import { AvatarSelector } from '@/components/AvatarSelector';
import { AvatarBorder } from '@/components/AvatarBorder';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { ConcursoBadge } from '@/components/ConcursoBadge';
import { AddFriendsModal } from '@/components/AddFriendsModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { FriendRequests } from '@/components/FriendRequests';
import { FriendProfileModal } from '@/components/FriendProfileModal';
import { NotificationBell } from '@/components/NotificationBell';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';
import {
 ChevronLeft,
 MapPin,
 Calendar,
 Users,
 Edit,
 BookOpen,