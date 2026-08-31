import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Sparkles } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-svh lg:grid-cols-2">
            {/* ── Left panel: Brand showcase ── */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035] lg:flex lg:flex-col lg:justify-between">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute -top-32 -right-32 size-[400px] rounded-full bg-[#C1502E]/10 blur-[100px]"
                        style={{ animation: 'float 8s ease-in-out infinite' }}
                    />
                    <div
                        className="absolute top-1/3 -left-16 size-[300px] rounded-full bg-[#D9C4A3]/8 blur-[80px]"
                        style={{
                            animation:
                                'float-reverse 10s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute right-1/4 -bottom-16 size-[350px] rounded-full bg-[#1B3A5C]/20 blur-[60px]"
                        style={{
                            animation: 'pulse-soft 6s ease-in-out infinite',
                        }}
                    />
                </div>

                {/* Grid pattern overlay */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Top: Logo */}
                <div className="relative z-10 p-10">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2.5"
                    >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                            <span className="text-sm font-bold text-white">
                                SE
                            </span>
                        </div>
                        <span className="font-serif text-xl font-bold text-white">
                            SpotEvent
                            <span className="text-[#C1502E]">.id</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Hero copy */}
                <div className="relative z-10 px-10 lg:px-14">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                        <Sparkles className="size-3.5 text-[#D9C4A3]" />
                        <span className="text-xs font-medium text-white/70">
                            Platform Event #1 di Indonesia
                        </span>
                    </div>
                    <h2 className="mb-4 max-w-md font-serif text-3xl leading-tight font-bold text-white xl:text-4xl">
                        Kelola Event dengan{' '}
                        <span className="bg-gradient-to-r from-[#D9C4A3] to-[#C1502E] bg-clip-text text-transparent">
                            Mudah & Aman
                        </span>
                    </h2>
                    <p className="max-w-sm text-sm leading-relaxed text-white/50">
                        Buat, kelola, dan jual tiket event dalam satu platform
                        yang dipercaya oleh para event organizer di Indonesia.
                    </p>
                </div>

                {/* Bottom: Stats */}
                <div className="relative z-10 p-10">
                    <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                        {[
                            { value: '10K+', label: 'Events' },
                            { value: '500K+', label: 'Peserta' },
                            { value: '100+', label: 'Kota' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="font-serif text-xl font-bold text-white">
                                    {stat.value}
                                </div>
                                <div className="mt-0.5 text-xs text-white/40">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right panel: Auth form ── */}
            <div className="bg-background flex flex-col">
                {/* Mobile logo */}
                <div className="flex items-center justify-center px-6 pt-8 lg:hidden">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2.5"
                    >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-[#1B3A5C]">
                            <span className="text-sm font-bold text-white">
                                SE
                            </span>
                        </div>
                        <span className="text-foreground font-serif text-xl font-bold">
                            SpotEvent
                            <span className="text-[#C1502E]">.id</span>
                        </span>
                    </Link>
                </div>

                {/* Centered form area */}
                <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
                    <div className="w-full max-w-sm">
                        {/* Title / description */}
                        <div className="mb-8 space-y-2">
                            <h1 className="text-foreground font-serif text-2xl font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {description}
                            </p>
                        </div>

                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-muted-foreground/50 text-xs">
                        &copy; 2026 SpotEvent.id. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
