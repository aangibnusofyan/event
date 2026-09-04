import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { home } from '@/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Copy,
    ExternalLink,
    Globe,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    Share2,
    Star,
    Ticket,
    Users,
    Video,
    Youtube,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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

interface EventTicketItem {
    id: number;
    name: string;
    type: 'free' | 'paid';
    tier: string;
    price: number;
    formatted_price: string;
    quantity: number;
    quantity_sold: number;
    remaining: number;
    description?: string | null;
}

interface EventAgendaItem {
    id: number;
    title: string;
    description?: string | null;
    start_time: string;
    end_time: string;
    speaker_name?: string | null;
    stage_or_room?: string | null;
}

interface EventSpeakerItem {
    id: number;
    name: string;
    role_or_title?: string | null;
    organization?: string | null;
    bio?: string | null;
    avatar?: string | null;
}

interface EventSponsorItem {
    id: number;
    name: string;
    tier: string;
    logo?: string | null;
    website_url?: string | null;
}

interface VendorEvent {
    id: number;
    slug?: string;
    title: string;
    summary?: string | null;
    description?: string | null;
    event_type?: 'online' | 'offline' | 'hybrid';
    date: string;
    time: string;
    start_date_time?: string;
    end_date_time?: string;
    timezone?: string;
    location: string;
    venue_name?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    google_maps_url?: string | null;
    online_platform?: string | null;
    streaming_link?: string | null;
    streaming_instructions?: string | null;
    price: string;
    category: string;
    image: string | null;
    status: 'upcoming' | 'past';
    tickets?: EventTicketItem[];
    agendas?: EventAgendaItem[];
    speakers?: EventSpeakerItem[];
    sponsors?: EventSponsorItem[];
}

interface VendorData {
    id?: number;
    name: string;
    email?: string;
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

    const [selectedEvent, setSelectedEvent] = useState<VendorEvent | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Auto-open event detail if URL contains ?event=ID
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const eventId = params.get('event');
            if (eventId) {
                const target = events.find((e) => e.id === Number(eventId));
                if (target) {
                    setSelectedEvent(target);
                    setIsDetailOpen(true);
                }
            }
        }
    }, [events]);

    const handleSelectEvent = (event: VendorEvent) => {
        setSelectedEvent(event);
        setIsDetailOpen(true);
    };

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
                <HeroSection
                    vendor={vendor}
                    onContactClick={() => setIsContactOpen(true)}
                    onShareClick={() => setIsShareOpen(true)}
                />
                <StatsSection stats={vendor.stats} />
                <BioSection vendor={vendor} />
                {upcomingEvents.length > 0 && (
                    <EventsSection
                        title="Event Mendatang"
                        subtitle="Event yang akan datang dari vendor ini"
                        events={upcomingEvents}
                        onSelectEvent={handleSelectEvent}
                    />
                )}
                {pastEvents.length > 0 && (
                    <EventsSection
                        title="Event Sebelumnya"
                        subtitle="Event yang sudah selesai diselenggarakan"
                        events={pastEvents}
                        onSelectEvent={handleSelectEvent}
                        muted
                    />
                )}
                <CTASection
                    vendor={vendor}
                    onContactClick={() => setIsContactOpen(true)}
                />
            </main>

            {/* Modal Detail Event */}
            <EventDetailDialog
                event={selectedEvent}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                vendor={vendor}
            />

            {/* Modal Hubungi Vendor */}
            <ContactVendorDialog
                open={isContactOpen}
                onOpenChange={setIsContactOpen}
                vendor={vendor}
            />

            {/* Modal Bagikan Profil */}
            <ShareVendorDialog
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
                vendor={vendor}
            />

            <Footer />
        </>
    );
}

/* ─────────────────────────────────────────────
 * Hero Section
 * ───────────────────────────────────────────── */

function HeroSection({
    vendor,
    onContactClick,
    onShareClick,
}: {
    vendor: VendorData;
    onContactClick: () => void;
    onShareClick: () => void;
}) {
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
                        <Button
                            type="button"
                            onClick={onContactClick}
                            className="bg-[#C1502E] px-6 text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90 cursor-pointer gap-2"
                        >
                            <MessageCircle className="size-4" />
                            Hubungi
                        </Button>
                        <Button
                            type="button"
                            onClick={onShareClick}
                            className="bg-[#8C6538] text-white hover:bg-[#785324] shadow-md border-0 px-6 font-medium gap-2 transition-colors cursor-pointer"
                        >
                            <Share2 className="size-4" />
                            <span>Bagikan</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="pointer-events-none absolute -bottom-1 left-0 right-0 overflow-hidden leading-none z-0">
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block w-full h-12 sm:h-16 lg:h-20"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 85H1440V40C1440 40 1320 0 1080 20C840 40 720 60 480 40C240 20 120 0 0 20V85Z"
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
        <section className="relative z-10 bg-background -mt-3 pt-2 pb-6">
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
    onSelect,
}: {
    event: VendorEvent;
    index: number;
    muted?: boolean;
    onSelect: (event: VendorEvent) => void;
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
                onClick={() => onSelect(event)}
                className={cn(
                    'group border-border/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
                    muted && 'opacity-75 hover:opacity-100',
                )}
            >
                {/* Event Image / Placeholder */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#1B3A5C]/20 via-[#152E4A]/10 to-[#D9C4A3]/20">
                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Ticket className="text-primary/20 size-12" />
                        </div>
                    )}
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
                        <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(event);
                            }}
                            className="bg-[#1B3A5C] text-white hover:bg-[#1B3A5C]/90"
                        >
                            Lihat Detail
                        </Button>
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
    onSelectEvent,
}: {
    title: string;
    subtitle: string;
    events: VendorEvent[];
    muted?: boolean;
    onSelectEvent: (event: VendorEvent) => void;
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
                            onSelect={onSelectEvent}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function EventDetailDialog({
    event,
    open,
    onOpenChange,
    vendor,
}: {
    event: VendorEvent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vendor: VendorData;
}) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'tickets' | 'agenda' | 'speakers'>('info');

    // Always reset tab to Deskripsi & Detail when dialog opens or event changes
    useEffect(() => {
        if (open) {
            setActiveTab('info');
        }
    }, [open, event?.id]);

    if (!event) return null;

    const handleCopyLink = () => {
        const url = window.location.origin + window.location.pathname + `?event=${event.id}`;
        copyTextToClipboard(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[94vw] sm:max-w-2xl md:max-w-3xl max-h-[92vh] overflow-hidden p-0 rounded-2xl flex flex-col gap-0 border-border/80 shadow-2xl">
                {/* Banner / Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950 shrink-0">
                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="size-full object-cover object-center"
                        />
                    ) : (
                        <div className="size-full flex items-center justify-center bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035]">
                            <Ticket className="size-16 text-white/30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <Badge className="bg-[#1B3A5C] text-white border-0 shadow-md">
                            {event.category}
                        </Badge>
                        <Badge
                            className={cn(
                                'text-white shadow-md border-0',
                                event.event_type === 'online'
                                    ? 'bg-blue-600'
                                    : event.event_type === 'hybrid'
                                      ? 'bg-purple-600'
                                      : 'bg-emerald-600',
                            )}
                        >
                            {event.event_type === 'online'
                                ? 'Virtual (Online)'
                                : event.event_type === 'hybrid'
                                  ? 'Hybrid (Fisik + Online)'
                                  : 'Tatap Muka (Offline)'}
                        </Badge>
                        {event.status === 'past' && (
                            <Badge variant="secondary" className="bg-neutral-800/90 text-neutral-300">
                                Selesai
                            </Badge>
                        )}
                    </div>

                    {/* Bottom banner info */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight line-clamp-2 drop-shadow-md">
                            {event.title}
                        </h2>
                        <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
                            <span>Diselenggarakan oleh</span>
                            <span className="font-semibold text-[#D9C4A3]">{vendor.name}</span>
                        </p>
                    </div>
                </div>

                {/* Subheader Quick Stats */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-neutral-50 px-6 py-3 text-xs text-muted-foreground dark:bg-neutral-900/50">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Calendar className="size-4 text-[#C1502E]" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="size-4 text-[#C1502E]" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate max-w-xs">
                            <MapPin className="size-4 text-[#C1502E] shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {event.status === 'past' ? (
                            <Badge variant="secondary" className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium text-xs">
                                Acara Telah Berakhir
                            </Badge>
                        ) : (
                            <span className="font-serif font-bold text-sm text-[#C1502E]">
                                Mulai {event.price}
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs inside modal */}
                <div className="flex border-b border-border px-6 pt-2 bg-background shrink-0 gap-4 overflow-x-auto text-sm">
                    <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={cn(
                            'pb-2.5 font-medium transition-colors border-b-2 -mb-px',
                            activeTab === 'info'
                                ? 'border-[#C1502E] text-[#C1502E] font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        Deskripsi & Detail
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('tickets')}
                        className={cn(
                            'pb-2.5 font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5',
                            activeTab === 'tickets'
                                ? 'border-[#C1502E] text-[#C1502E] font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        Tiket
                        {event.tickets && event.tickets.length > 0 && (
                            <span className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 text-[11px]">
                                {event.tickets.length}
                            </span>
                        )}
                    </button>
                    {event.agendas && event.agendas.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('agenda')}
                            className={cn(
                                'pb-2.5 font-medium transition-colors border-b-2 -mb-px',
                                activeTab === 'agenda'
                                    ? 'border-[#C1502E] text-[#C1502E] font-semibold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            Rundown ({event.agendas.length})
                        </button>
                    )}
                    {event.speakers && event.speakers.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('speakers')}
                            className={cn(
                                'pb-2.5 font-medium transition-colors border-b-2 -mb-px',
                                activeTab === 'speakers'
                                    ? 'border-[#C1502E] text-[#C1502E] font-semibold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            Pembicara ({event.speakers.length})
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {event.summary && (
                                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-foreground italic">
                                    "{event.summary}"
                                </div>
                            )}

                            <div>
                                <h4 className="font-serif font-bold text-base text-foreground mb-3">Tentang Acara Ini</h4>
                                {event.description ? (
                                    <div
                                        className="bg-transparent prose prose-sm dark:prose-invert max-w-none text-neutral-900 dark:text-neutral-100 leading-relaxed
                                            [&_*]:!bg-transparent
                                            [&_p]:!bg-transparent [&_span]:!bg-transparent [&_div]:!bg-transparent [&_h1]:!bg-transparent [&_h2]:!bg-transparent [&_h3]:!bg-transparent [&_h4]:!bg-transparent [&_h5]:!bg-transparent [&_h6]:!bg-transparent
                                            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-neutral-900 dark:[&_h2]:text-neutral-100
                                            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-neutral-900 dark:[&_h3]:text-neutral-100
                                            [&_p]:mb-2.5
                                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
                                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
                                            [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 dark:[&_blockquote]:border-neutral-700 [&_blockquote]:pl-3.5 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-neutral-600 dark:[&_blockquote]:text-neutral-400
                                            [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2"
                                        dangerouslySetInnerHTML={{ __html: formatEventDescription(event.description) }}
                                    />
                                ) : (
                                    <p className="text-muted-foreground italic">Belum ada rincian deskripsi tambahan.</p>
                                )}
                            </div>

                            {/* Location & Access Details */}
                            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    {event.event_type === 'online' ? (
                                        <Video className="size-4 text-blue-500" />
                                    ) : (
                                        <MapPin className="size-4 text-[#C1502E]" />
                                    )}
                                    {event.event_type === 'online' ? 'Akses Streaming & Platform' : 'Lokasi & Tempat Acara'}
                                </h4>

                                {event.event_type !== 'online' && (
                                    <div className="space-y-1.5 text-xs text-muted-foreground">
                                        <p className="font-medium text-foreground text-sm">{event.venue_name || 'Venue Ditentukan Panitia'}</p>
                                        {event.address && <p>{event.address}</p>}
                                        {(event.city || event.province) && (
                                            <p>{[event.city, event.province].filter(Boolean).join(', ')}</p>
                                        )}
                                        {event.google_maps_url && (
                                            <div className="pt-2">
                                                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" asChild>
                                                    <a href={event.google_maps_url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="size-3.5" />
                                                        Buka Navigasi Google Maps
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {event.event_type !== 'offline' && (
                                    <div className="space-y-3 text-xs text-muted-foreground pt-1">
                                        <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/30 p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Video className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                                <span className="font-semibold text-foreground text-sm">
                                                    Platform Acara:{' '}
                                                    <span className="text-blue-600 dark:text-blue-400">
                                                        {event.online_platform || 'Online Meeting / Streaming'}
                                                    </span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Acara ini diselenggarakan secara online/virtual. Tautan atau link akses pertemuan akan dibagikan oleh penyelenggara kepada peserta yang telah mendaftar sebelum acara dimulai.
                                            </p>
                                        </div>

                                        {event.streaming_instructions && (
                                            <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
                                                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
                                                    Petunjuk / Catatan Acara:
                                                </p>
                                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                                    {event.streaming_instructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sponsors if available */}
                            {event.sponsors && event.sponsors.length > 0 && (
                                <div>
                                    <h4 className="font-serif font-bold text-base text-foreground mb-3 flex items-center gap-2">
                                        <Award className="size-4 text-[#C1502E]" />
                                        Sponsor & Mitra
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {event.sponsors.map((sp) => (
                                            <div key={sp.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2.5">
                                                {sp.logo ? (
                                                    <img src={sp.logo} alt={sp.name} className="size-6 object-contain" />
                                                ) : (
                                                    <Building2 className="size-5 text-muted-foreground" />
                                                )}
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">{sp.name}</p>
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{sp.tier}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-serif font-bold text-base text-foreground">Kategori Tiket Acara</h4>
                                <span className="text-xs text-muted-foreground">Total {event.tickets?.length ?? 0} kategori tiket</span>
                            </div>

                            {(!event.tickets || event.tickets.length === 0) ? (
                                <p className="text-muted-foreground py-6 text-center">Belum ada tier tiket yang dikonfigurasi.</p>
                            ) : (
                                <div className="grid gap-3">
                                    {event.tickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="rounded-xl border border-border bg-card p-4 transition-all hover:border-[#C1502E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-semibold text-foreground text-base">{ticket.name}</h5>
                                                    <Badge variant="outline" className="text-[10px] uppercase">
                                                        {ticket.tier.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                {ticket.description && (
                                                    <p className="mt-1 text-xs text-muted-foreground">{ticket.description}</p>
                                                )}
                                                <p className="text-[11px] text-muted-foreground">
                                                    {event.status === 'past'
                                                        ? 'Penjualan Ditutup (Event Selesai)'
                                                        : (ticket.remaining > 0 ? `Tersedia sisa ${ticket.remaining} kuota` : 'Tiket Habis')}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                                                <span className="font-serif font-bold text-lg text-[#C1502E]">
                                                    {ticket.formatted_price}
                                                </span>
                                                {event.status !== 'past' ? (
                                                    <Button
                                                        size="sm"
                                                        type="button"
                                                        className="bg-[#C1502E] hover:bg-[#C1502E]/90 text-white text-xs px-4 shadow-sm gap-1.5 cursor-pointer"
                                                    >
                                                        <Ticket className="size-3.5" />
                                                        Daftar Sekarang
                                                    </Button>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[11px] py-1 px-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                                                        Selesai
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'agenda' && (
                        <div className="space-y-4">
                            <h4 className="font-serif font-bold text-base text-foreground">Susunan Acara (Rundown)</h4>
                            <div className="relative border-l-2 border-border/80 pl-4 ml-2 space-y-4">
                                {event.agendas?.map((item) => (
                                    <div key={item.id} className="relative group">
                                        <div className="absolute -left-[23px] top-1.5 size-3 rounded-full border-2 border-background bg-[#C1502E]" />
                                        <div className="flex items-center gap-2 text-xs font-semibold text-[#C1502E]">
                                            <Clock className="size-3.5" />
                                            <span>{item.start_time} - {item.end_time}</span>
                                            {item.stage_or_room && (
                                                <Badge variant="secondary" className="text-[10px] py-0">
                                                    {item.stage_or_room}
                                                </Badge>
                                            )}
                                        </div>
                                        <h5 className="font-semibold text-foreground text-sm mt-1">{item.title}</h5>
                                        {item.speaker_name && (
                                            <p className="text-xs text-muted-foreground mt-0.5">Oleh: {item.speaker_name}</p>
                                        )}
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'speakers' && (
                        <div className="space-y-4">
                            <h4 className="font-serif font-bold text-base text-foreground">Pembicara & Narasumber</h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {event.speakers?.map((speaker) => (
                                    <div key={speaker.id} className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start">
                                        <Avatar className="size-12 border border-border">
                                            {speaker.avatar && <AvatarImage src={speaker.avatar} alt={speaker.name} />}
                                            <AvatarFallback className="bg-[#1B3A5C] text-white font-semibold">
                                                {speaker.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h5 className="font-semibold text-foreground text-sm">{speaker.name}</h5>
                                            <p className="text-xs text-[#C1502E] font-medium">
                                                {[speaker.role_or_title, speaker.organization].filter(Boolean).join(' • ')}
                                            </p>
                                            {speaker.bio && (
                                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {speaker.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Modal Actions */}
                <div className="flex items-center justify-between border-t border-border bg-neutral-50 dark:bg-neutral-900/60 p-4 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="gap-1.5 text-xs cursor-pointer"
                    >
                        {copied ? <CheckCircle2 className="size-3.5 text-green-600" /> : <Share2 className="size-3.5" />}
                        <span>{copied ? 'Link Disalin!' : 'Bagikan'}</span>
                    </Button>

                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-xs px-4 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Tutup
                        </Button>
                        {event.status !== 'past' ? (
                            <Button
                                type="button"
                                className="bg-[#C1502E] hover:bg-[#C1502E]/90 text-white font-medium text-xs sm:text-sm px-6 shadow-md shadow-[#C1502E]/25 gap-2 cursor-pointer"
                            >
                                <Ticket className="size-4" />
                                <span>Daftar Sekarang</span>
                            </Button>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium text-xs px-3.5 py-1.5"
                            >
                                Event Telah Berakhir
                            </Badge>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ─────────────────────────────────────────────
 * CTA Section
 * ───────────────────────────────────────────── */

function CTASection({
    vendor,
    onContactClick,
}: {
    vendor: VendorData;
    onContactClick: () => void;
}) {
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
                        type="button"
                        size="lg"
                        onClick={onContactClick}
                        className="bg-[#C1502E] px-10 text-base text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90 cursor-pointer gap-2"
                    >
                        <MessageCircle className="size-4" />
                        Hubungi Vendor
                    </Button>
                    <Button
                        size="lg"
                        className="bg-[#8C6538] px-10 text-base text-white shadow-md hover:bg-[#785324] border-0 font-medium"
                        asChild
                    >
                        <Link href={home().url}>Kembali ke Beranda</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────── */

function formatEventDescription(description?: string): string {
    if (!description) return '';
    let html = description;

    if (!/<[a-z][\s\S]*>/i.test(html)) {
        html = html
            .split(/\r?\n\r?\n/)
            .map((p) => `<p>${p.replace(/\r?\n/g, '<br/>')}</p>`)
            .join('');
    }

    // Strip inline background-color and background properties from style attributes
    html = html.replace(/\bstyle=(["'])(.*?)\1/gi, (_, quote, styleContent) => {
        const cleanedStyle = styleContent
            .replace(/background(-color|-image)?\s*:\s*[^;]+;?/gi, '')
            .trim();
        return cleanedStyle ? `style=${quote}${cleanedStyle}${quote}` : '';
    });

    // Strip background classes (e.g., bg-white, bg-neutral-100) from HTML tags
    html = html.replace(/\bclass=(["'])(.*?)\1/gi, (_, quote, classContent) => {
        const cleanedClass = classContent
            .replace(/\bbg-\S+/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        return cleanedClass ? `class=${quote}${cleanedClass}${quote}` : '';
    });

    return html;
}

function copyTextToClipboard(text: string): boolean {
    if (typeof window === 'undefined') return false;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {});
        return true;
    }
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        return true;
    } catch {
        return false;
    }
}

/* ─────────────────────────────────────────────
 * Contact Vendor Dialog
 * ───────────────────────────────────────────── */

function ContactVendorDialog({
    open,
    onOpenChange,
    vendor,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vendor: VendorData;
}) {
    const [senderName, setSenderName] = useState('');
    const [senderContact, setSenderContact] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSent(true);
    };

    const handleCopyEmail = () => {
        if (vendor.email) {
            copyTextToClipboard(vendor.email);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        }
    };

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Halo ${vendor.name}, saya menemukan profil Anda di SpotEvent.id dan tertarik ingin berdiskusi mengenai event Anda.`
    )}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
                <div className="bg-gradient-to-r from-[#1B3A5C] via-[#183656] to-[#0F2035] p-6 text-white">
                    <div className="flex items-center gap-3.5">
                        <Avatar className="size-14 ring-2 ring-white/20">
                            {vendor.avatar && <AvatarImage src={vendor.avatar} alt={vendor.name} className="object-cover" />}
                            <AvatarFallback className="bg-[#C1502E] font-serif text-xl font-bold text-white">
                                {vendor.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-serif text-xl font-bold text-white leading-tight">
                                Hubungi {vendor.name}
                            </h3>
                            <p className="text-xs text-white/70 mt-0.5">@{vendor.username}</p>
                            <span className="inline-block text-[11px] text-[#D9C4A3] mt-1 font-medium">
                                ⭐ {vendor.stats.rating} / 5.0 • {vendor.stats.totalEvents} Event
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
                    {isSent ? (
                        <div className="py-8 text-center space-y-3">
                            <div className="mx-auto size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-7" />
                            </div>
                            <h4 className="font-serif font-bold text-lg text-foreground">
                                Pesan Berhasil Terkirim!
                            </h4>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                Terima kasih telah menghubungi <span className="font-semibold text-foreground">{vendor.name}</span>. Vendor akan segera merespons pesan Anda ke kontak yang telah Anda cantumkan.
                            </p>
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                        setIsSent(false);
                                        setMessage('');
                                        onOpenChange(false);
                                    }}
                                    className="bg-[#1B3A5C] hover:bg-[#152E4A] text-white font-medium px-6"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Fast Direct Contacts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {vendor.email && (
                                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-muted/30">
                                        <div className="min-w-0 flex items-center gap-2">
                                            <Mail className="size-4 text-[#C1502E] shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
                                                <p className="text-xs font-medium text-foreground truncate">{vendor.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                type="button"
                                                onClick={handleCopyEmail}
                                                className="h-7 px-2 text-xs"
                                                title="Salin Email"
                                            >
                                                {copiedEmail ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-xs"
                                                asChild
                                            >
                                                <a href={`mailto:${vendor.email}?subject=Tanya%20Event%20${encodeURIComponent(vendor.name)}`}>
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-emerald-900/60 dark:bg-emerald-950/30 transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MessageCircle className="size-4 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-semibold">WhatsApp</p>
                                            <p className="text-xs font-medium text-emerald-950 dark:text-emerald-200">Chat Langsung</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="size-3.5 text-emerald-600" />
                                </a>
                            </div>

                            {/* Message Form */}
                            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
                                <div className="space-y-1">
                                    <Label htmlFor="senderName" className="text-xs font-medium">Nama Anda</Label>
                                    <Input
                                        id="senderName"
                                        placeholder="Contoh: Budi Santoso"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="senderContact" className="text-xs font-medium">Email atau Nomor WhatsApp Anda</Label>
                                    <Input
                                        id="senderContact"
                                        placeholder="budi@example.com / 08123456789"
                                        value={senderContact}
                                        onChange={(e) => setSenderContact(e.target.value)}
                                        required
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="subject" className="text-xs font-medium">Subjek / Topik (Opsional)</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Pertanyaan seputar tiket / sponsor event..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="message" className="text-xs font-medium">Pesan Anda</Label>
                                    <Textarea
                                        id="message"
                                        rows={3}
                                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="text-xs resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#C1502E] hover:bg-[#C1502E]/90 text-white font-medium gap-2 shadow-md"
                                >
                                    <Send className="size-4" />
                                    Kirim Pesan ke Vendor
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ─────────────────────────────────────────────
 * Share Vendor Dialog
 * ───────────────────────────────────────────── */

function ShareVendorDialog({
    open,
    onOpenChange,
    vendor,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vendor: VendorData;
}) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `http://event.test/${vendor.username}`;

    const handleCopy = () => {
        copyTextToClipboard(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const shareItems = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle className="size-4 text-emerald-600" />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Lihat profil event ${vendor.name} di SpotEvent.id:\n${shareUrl}`)}`,
            color: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40',
        },
        {
            name: 'X (Twitter)',
            icon: <XIcon className="size-4" />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Lihat profil event ${vendor.name} di SpotEvent.id`)}&url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800',
        },
        {
            name: 'Facebook',
            icon: <Globe className="size-4 text-blue-600" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950/40',
        },
        {
            name: 'LinkedIn',
            icon: <Users className="size-4 text-sky-600" />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:hover:bg-sky-950/40',
        },
        {
            name: 'Telegram',
            icon: <Send className="size-4 text-blue-500" />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Profil Vendor Event ${vendor.name}`)}`,
            color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950/40',
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-md p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
                <div className="bg-gradient-to-r from-[#1B3A5C] via-[#183656] to-[#0F2035] p-5 text-white">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <Share2 className="size-5 text-[#D9C4A3]" />
                        Bagikan Profil Vendor
                    </h3>
                    <p className="text-xs text-white/70 mt-1">
                        Bagikan profil {vendor.name} ke rekan atau media sosial
                    </p>
                </div>

                <div className="p-6 space-y-5 text-sm">
                    {/* Copy Link Section */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Tautan Profil</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                value={shareUrl}
                                className="font-mono text-xs bg-muted/40 h-9 select-all"
                            />
                            <Button
                                type="button"
                                onClick={handleCopy}
                                className="h-9 px-3.5 bg-[#8C6538] hover:bg-[#785324] text-white shrink-0 text-xs gap-1.5 font-medium shadow-sm cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="size-3.5 text-emerald-300" />
                                        Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-3.5" />
                                        Salin
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Grid */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Bagikan Langsung Ke
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {shareItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground transition-all cursor-pointer',
                                        item.color
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
