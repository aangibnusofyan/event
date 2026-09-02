import { Head, Link } from '@inertiajs/react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { home } from '@/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
    Calendar,
    Clock,
    Globe,
    Instagram,
    MapPin,
    MessageCircle,
    Star,
    Ticket,
    Youtube,
    Users,
} from 'lucide-react';

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
            <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
    );
}

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5" />
        </svg>
    );
}

interface VendorEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    category: string;
    image: string | null;
    status: 'upcoming' | 'past';
}

interface VendorData {
    name: string;
    username: string;
    avatar: string | null;
    bio: string;
    location: string;
    joinedAt: string;
    stats: {
        totalEvents: number;
        totalAttendees: number;
        rating: number;
    };
    socialLinks: {
        instagram?: string;
        x?: string;
        tiktok?: string;
        youtube?: string;
        website?: string;
    };
}

interface Props {
    vendor: VendorData;
    events: VendorEvent[];
}

export default function VendorShow({ vendor, events }: Props) {
    const upcomingEvents = events.filter((e) => e.status === 'upcoming');
    const pastEvents = events.filter((e) => e.status === 'past');

    return (
        <>
            <Head title={`${vendor.name} — SpotEvent.id`}>
                <meta
                    name="description"
                    content={`Profil ${vendor.name} di SpotEvent.id — ${vendor.bio.slice(0, 150)}...`}
                />
            </Head>

            <Navbar hideNavItems />

            <main>
                <HeroSection vendor={vendor} />
                <StatsSection stats={vendor.stats} />
                <BioSection vendor={vendor} />
                {upcomingEvents.length > 0 && (
                    <EventsSection
                        title="Event Mendatang"
                        subtitle="Event yang akan datang dari vendor ini"
                        events={upcomingEvents}
                    />
                )}
                {pastEvents.length > 0 && (
                    <EventsSection
                        title="Event Sebelumnya"
                        subtitle="Event yang sudah selesai diselenggarakan"
                        events={pastEvents}
                        muted
                    />
                )}
                <CTASection vendor={vendor} />
            </main>

            <Footer />
        </>
    );
}

/* ─────────────────────────────────────────────
 * Hero Section
 * ───────────────────────────────────────────── */

function HeroSection({ vendor }: { vendor: VendorData }) {
    const initials = vendor.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035] pt-28 pb-20 lg:pt-36 lg:pb-28">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 size-[500px] rounded-full bg-[#C1502E]/10 blur-[120px]"
                    style={{ animation: 'float 8s ease-in-out infinite' }}
                />
                <div
                    className="absolute top-1/3 -left-20 size-[350px] rounded-full bg-[#D9C4A3]/8 blur-[100px]"
                    style={{
                        animation: 'float-reverse 10s ease-in-out infinite',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:gap-8 lg:text-left">
                    {/* Avatar */}
                    <Avatar className="ring-background/20 size-28 ring-4 lg:size-36">
                        {vendor.avatar && <AvatarImage src={vendor.avatar} alt={vendor.name} className="object-cover" />}
                        <AvatarFallback className="bg-[#C1502E] font-serif text-3xl font-bold text-white lg:text-4xl">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="mt-6 flex-1 lg:mt-0">
                        <h1 className="font-serif text-3xl font-bold text-white lg:text-5xl">
                            {vendor.name}
                        </h1>
                        <p className="mt-2 text-lg text-white/50">
                            @{vendor.username}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60 lg:justify-start">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                {vendor.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                Bergabung {vendor.joinedAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="size-4 text-[#D9C4A3]" />
                                {vendor.stats.rating} / 5.0
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 lg:mt-0">
                        <Button className="bg-[#C1502E] px-6 text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90">
                            <MessageCircle className="size-4" />
                            Hubungi
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white/25 text-white hover:bg-white/10 hover:text-white"
                        >
                            Bagikan
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute right-0 bottom-0 left-0">
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 80H1440V40C1440 40 1320 0 1080 20C840 40 720 60 480 40C240 20 120 0 0 20V80Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * Stats Section
 * ───────────────────────────────────────────── */

interface StatItemProps {
    value: string;
    label: string;
    icon: React.ReactNode;
}

function StatItem({ value, label, icon }: StatItemProps) {
    return (
        <div className="flex flex-col items-center gap-2 px-6 py-4">
            <div className="text-primary/80 mb-1">{icon}</div>
            <span className="text-foreground font-serif text-2xl font-bold lg:text-3xl">
                {value}
            </span>
            <span className="text-muted-foreground text-sm">{label}</span>
        </div>
    );
}

function StatsSection({
    stats,
}: {
    stats: VendorData['stats'];
}) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="bg-background -mt-1 py-4">
            <div
                ref={ref}
                className={cn(
                    'mx-auto max-w-4xl px-6 transition-all duration-700 lg:px-8',
                    isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0',
                )}
            >
                <Card className="border-border/50 shadow-lg">
                    <CardContent className="p-0">
                        <div className="divide-border grid grid-cols-3 divide-x">
                            <StatItem
                                value={stats.totalEvents.toString()}
                                label="Total Event"
                                icon={
                                    <Ticket className="size-5" />
                                }
                            />
                            <StatItem
                                value={stats.totalAttendees.toLocaleString(
                                    'id-ID',
                                )}
                                label="Total Peserta"
                                icon={
                                    <Users className="size-5" />
                                }
                            />
                            <StatItem
                                value={`${stats.rating}/5`}
                                label="Rating"
                                icon={
                                    <Star className="size-5" />
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * Bio Section
 * ───────────────────────────────────────────── */

function BioSection({ vendor }: { vendor: VendorData }) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="bg-background py-12 lg:py-16">
            <div
                ref={ref}
                className={cn(
                    'mx-auto max-w-7xl px-6 transition-all duration-700 lg:px-8',
                    isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0',
                )}
            >
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Bio */}
                    <div className="lg:col-span-2">
                        <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                            Tentang
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {vendor.bio}
                        </p>
                    </div>

                    {/* Social & Info Card */}
                    <div>
                        <Card className="border-border/50">
                            <CardContent className="space-y-4 p-6">
                                {(vendor.socialLinks?.instagram || vendor.socialLinks?.x || vendor.socialLinks?.tiktok || vendor.socialLinks?.youtube || vendor.socialLinks?.website) && (
                                    <>
                                        <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider">
                                            Media Sosial
                                        </h3>
                                        <div className="flex gap-3">
                                            {vendor.socialLinks.instagram && (
                                                <a
                                                    href={vendor.socialLinks.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-xl transition-colors"
                                                    aria-label="Instagram"
                                                >
                                                    <Instagram className="size-4" />
                                                </a>
                                            )}
                                            {vendor.socialLinks.x && (
                                                <a
                                                    href={vendor.socialLinks.x}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-xl transition-colors"
                                                    aria-label="X"
                                                >
                                                    <XIcon className="size-4" />
                                                </a>
                                            )}
                                            {vendor.socialLinks.tiktok && (
                                                <a
                                                    href={vendor.socialLinks.tiktok}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-xl transition-colors"
                                                    aria-label="TikTok"
                                                >
                                                    <TiktokIcon className="size-4" />
                                                </a>
                                            )}
                                            {vendor.socialLinks.youtube && (
                                                <a
                                                    href={vendor.socialLinks.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-xl transition-colors"
                                                    aria-label="YouTube"
                                                >
                                                    <Youtube className="size-4" />
                                                </a>
                                            )}
                                            {vendor.socialLinks.website && (
                                                <a
                                                    href={vendor.socialLinks.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-xl transition-colors"
                                                    aria-label="Website"
                                                >
                                                    <Globe className="size-4" />
                                                </a>
                                            )}
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="text-muted-foreground size-4" />
                                        <span className="text-foreground">
                                            {vendor.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground size-4" />
                                        <span className="text-foreground">
                                            Bergabung {vendor.joinedAt}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * Events Section
 * ───────────────────────────────────────────── */

function EventCard({
    event,
    index,
    muted,
}: {
    event: VendorEvent;
    index: number;
    muted?: boolean;
}) {
    const { ref, isVisible } = useScrollAnimation(0.1);

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0',
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <Card
                className={cn(
                    'group border-border/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                    muted && 'opacity-75 hover:opacity-100',
                )}
            >
                {/* Image Placeholder */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#1B3A5C]/20 via-[#152E4A]/10 to-[#D9C4A3]/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Ticket className="text-primary/20 size-12" />
                    </div>
                    {/* Category badge */}
                    <Badge className="absolute top-3 left-3 bg-[#1B3A5C]/90 text-white backdrop-blur-sm">
                        {event.category}
                    </Badge>
                    {/* Status badge */}
                    {event.status === 'past' && (
                        <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 bg-black/50 text-white backdrop-blur-sm"
                        >
                            Selesai
                        </Badge>
                    )}
                </div>

                <CardContent className="space-y-3 p-5">
                    <h3 className="text-foreground line-clamp-2 font-serif text-lg font-bold leading-tight transition-colors group-hover:text-[#C1502E]">
                        {event.title}
                    </h3>

                    <div className="text-muted-foreground space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-3.5 shrink-0" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="size-3.5 shrink-0" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-3.5 shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="font-serif text-lg font-bold text-[#C1502E]">
                            {event.price}
                        </span>
                        {event.status === 'upcoming' && (
                            <Button
                                size="sm"
                                className="bg-[#1B3A5C] text-white hover:bg-[#1B3A5C]/90"
                            >
                                Lihat Detail
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function EventsSection({
    title,
    subtitle,
    events,
    muted,
}: {
    title: string;
    subtitle: string;
    events: VendorEvent[];
    muted?: boolean;
}) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="bg-background py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section heading */}
                <div
                    ref={ref}
                    className={cn(
                        'mb-10 transition-all duration-700',
                        isVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0',
                    )}
                >
                    <h2 className="text-foreground font-serif text-2xl font-bold tracking-tight lg:text-3xl">
                        {title}
                    </h2>
                    <p className="text-muted-foreground mt-2">{subtitle}</p>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, idx) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={idx}
                            muted={muted}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * CTA Section
 * ───────────────────────────────────────────── */

function CTASection({ vendor }: { vendor: VendorData }) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035] py-20 lg:py-28">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-1/4 size-64 rounded-full bg-[#C1502E]/10 blur-[80px]" />
                <div className="absolute bottom-0 left-1/4 size-48 rounded-full bg-[#D9C4A3]/10 blur-[60px]" />
            </div>

            <div
                ref={ref}
                className={cn(
                    'relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 lg:px-8',
                    isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0',
                )}
            >
                <h2 className="mb-6 font-serif text-3xl font-bold text-white lg:text-4xl">
                    Tertarik dengan event dari {vendor.name}?
                </h2>
                <p className="mb-10 text-lg text-white/60">
                    Hubungi vendor ini untuk informasi lebih lanjut atau lihat
                    event-event yang tersedia.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-[#C1502E] px-10 text-base text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90"
                    >
                        <MessageCircle className="size-4" />
                        Hubungi Vendor
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white/25 px-10 text-base text-white hover:bg-white/10 hover:text-white"
                        asChild
                    >
                        <Link href={home().url}>Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
