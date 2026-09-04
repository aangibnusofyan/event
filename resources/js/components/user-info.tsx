import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import type { Auth, User } from '@/types';

/**
 * Resolves a dynamic profile photo URL for any logged-in user or vendor.
 * Handles `avatar_url`, `avatar`, `profile_photo_url`, storage paths, and external URLs.
 */
export function getUserAvatarUrl(user?: Partial<User> | Record<string, unknown> | null): string | null {
    if (!user) return null;

    const rawPhoto = (
        user.avatar_url ||
        user.avatar ||
        (user as Record<string, unknown>).profile_photo_url ||
        (user as Record<string, unknown>).profile_image
    ) as string | null | undefined;

    if (!rawPhoto || typeof rawPhoto !== 'string' || !rawPhoto.trim()) {
        return null;
    }

    const trimmed = rawPhoto.trim();

    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
    ) {
        return trimmed;
    }

    if (trimmed.startsWith('/')) {
        return trimmed;
    }

    if (trimmed.startsWith('storage/')) {
        return `/${trimmed}`;
    }

    return `/storage/${trimmed}`;
}

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUser = user || auth?.user;
    const getInitials = useInitials();
    const [hasImageError, setHasImageError] = useState(false);

    const avatarUrl = getUserAvatarUrl(currentUser);

    return (
        <>
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {avatarUrl && !hasImageError ? (
                    <img
                        src={avatarUrl}
                        alt={currentUser?.name ?? 'Foto Profil'}
                        className="h-8 w-8 rounded-full object-cover shrink-0"
                        onError={() => setHasImageError(true)}
                    />
                ) : (
                    <span className="text-xs font-semibold uppercase">
                        {getInitials(currentUser?.name ?? '')}
                    </span>
                )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser?.name}</span>
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">
                        {currentUser?.email}
                    </span>
                )}
            </div>
        </>
    );
}
