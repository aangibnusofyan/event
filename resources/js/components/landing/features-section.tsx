import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
    Award,
    BarChart3,
    Bot,
    Calendar,
    CreditCard,
    FileText,
    Globe,
    Lock,
    Mail,
    QrCode,
    Search,
    Shield,
    Ticket,
    Users,
    Video,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    text: string;
}

interface FeatureGroup {
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    features: Feature[];
}

const featureGroups: FeatureGroup[] = [
    {
        title: 'Untuk Event Organizer',
        description:
            'Tools lengkap untuk mengelola event dari awal hingga akhir.',
        icon: Calendar,
        gradient: 'from-[#1B3A5C] to-[#2A5580]',
        features: [
            { icon: Calendar, text: 'Manajemen Event Lengkap' },
            {
                icon: Ticket,
                text: 'Tiket Multi-Tier (VIP, Regular, Early Bird)',
            },
            { icon: QrCode, text: 'QR Code Check-in Real-time' },
            {
                icon: BarChart3,
                text: 'Dashboard Finansial & Analitik',
            },
            { icon: Mail, text: 'Broadcast WhatsApp & Email' },
            { icon: Award, text: 'E-Sertifikat Otomatis' },
        ],
    },
    {
        title: 'Untuk Peserta',
        description:
            'Pengalaman terbaik dari pencarian hingga kehadiran event.',
        icon: Users,
        gradient: 'from-[#C1502E] to-[#D06A4A]',
        features: [
            { icon: Search, text: 'Pencarian Event Multi-filter' },
            { icon: Users, text: 'Social Login (Google, dll)' },
            {
                icon: CreditCard,
                text: 'Pembayaran Multi-channel',
            },
            { icon: Users, text: 'Pendaftaran Massal' },
            { icon: FileText, text: 'E-Tiket PDF & QR Code' },
            {
                icon: Video,
                text: 'Link Streaming Terproteksi',
            },
        ],
    },
    {
        title: 'Keamanan & Infrastruktur',
        description:
            'Fondasi teknologi yang aman dan handal untuk setiap event.',
        icon: Shield,
        gradient: 'from-[#34363A] to-[#4A4C50]',
        features: [
            { icon: Bot, text: 'Sistem Antrian Anti-Bot' },
            { icon: Lock, text: 'Validasi Escrow Payment' },
            {
                icon: Shield,
                text: 'Proteksi Duplikasi QR Code',
            },
            { icon: Zap, text: 'API Gateway Terintegrasi' },
            { icon: Globe, text: 'Optimasi SEO & OpenGraph' },
            { icon: FileText, text: 'Log Audit Lengkap' },
        ],
    },
];

function FeatureCard({ group, index }: { group: FeatureGroup; index: number }) {
    const { ref, isVisible } = useScrollAnimation(0.1);
    const Icon = group.icon;

    return (
        <div
            ref={ref}
            className={cn(
                'group border-border/50 bg-background relative overflow-hidden rounded-2xl border p-8 transition-all duration-700 hover:-translate-y-1 hover:shadow-xl',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0',
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Icon header */}
            <div
                className={cn(
                    'mb-6 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                    group.gradient,
                )}
            >
                <Icon className="size-7" />
            </div>

            <h3 className="text-foreground mb-2 font-serif text-xl font-bold">
                {group.title}
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
                {group.description}
            </p>

            {/* Feature list */}
            <ul className="flex flex-col gap-3">
                {group.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                        <li
                            key={feature.text}
                            className="text-foreground/80 flex items-center gap-3 text-sm"
                        >
                            <FeatureIcon className="size-4 shrink-0 text-[#C1502E]" />
                            {feature.text}
                        </li>
                    );
                })}
            </ul>

            {/* Decorative hover glow */}
            <div
                className={cn(
                    'pointer-events-none absolute -right-20 -bottom-20 size-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10',
                    group.gradient,
                )}
            />
        </div>
    );
}

export function FeaturesSection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="fitur" className="bg-card py-20 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section heading */}
                <div
                    ref={ref}
                    className={cn(
                        'mb-16 text-center transition-all duration-700',
                        isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0',
                    )}
                >
                    <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
                        Fitur Unggulan
                    </span>
                    <h2 className="text-foreground font-serif text-3xl font-bold tracking-tight lg:text-4xl">
                        Semua yang Anda Butuhkan dalam Satu Platform
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Dari pembuatan event hingga analisis peserta,
                        SpotEvent.id menyediakan tools lengkap untuk kesuksesan
                        event Anda.
                    </p>
                </div>

                {/* Feature cards grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featureGroups.map((group, idx) => (
                        <FeatureCard
                            key={group.title}
                            group={group}
                            index={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
