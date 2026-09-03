import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    ExternalLink,
    Globe,
    Layers,
    MapPin,
    Plus,
    Radio,
    Sparkles,
    Tag,
    Ticket,
    TrendingUp,
    Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

interface RecentEvent {
    id: number;
    title: string;
    category: string;
    banner_image?: string | null;
    event_type: 'online' | 'offline' | 'hybrid';
    status: string;
    start_date_time: string;
    end_date_time: string;
    location: string;
    tickets_sold: number;
    tickets_total: number;
    price_label: string;
}

interface RecentCoupon {
    id: number;
    code: string;
    name: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    discount_label: string;
    usage_count: number;
    usage_limit?: number | null;
    is_active: boolean;
    expires_at?: string | null;
}

interface Props {
    vendor: {
        name: string;
        username: string;
        role: string;
    };
    stats: {
        totalEvents: number;
        publishedEvents: number;
        draftEvents: number;
        endedEvents: number;
        totalTicketsSold: number;
        totalTicketsQuota: number;
        estimatedRevenue: string;
        activeCouponsCount: number;
        totalCouponsUsed: number;
        typeBreakdown: {
            online: number;
            offline: number;
            hybrid: number;
        };
    };
    recentEvents: RecentEvent[];
    recentCoupons: RecentCoupon[];
}

export default function Dashboard({ vendor, stats, recentEvents, recentCoupons }: Props) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const occupancyRate = stats.totalTicketsQuota > 0
        ? Math.round((stats.totalTicketsSold / stats.totalTicketsQuota) * 100)
        : 0;

    return (
        <>
            <Head title="Vendor Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Welcome Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-white shadow-md dark:border dark:border-neutral-800 md:p-8">
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xs">
                                <Sparkles className="size-3.5 text-amber-300" />
                                <span>Portal Manajemen Vendor</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                Selamat Datang, {vendor.name}! 👋
                            </h1>
                            <p className="max-w-2xl text-sm text-neutral-300">
                                Pantau perkembangan penjualan tiket, kelola jadwal event mendatang, serta atur kupon diskon promo Anda dalam satu dashboard terpadu.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild size="default" className="gap-2 bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm">
                                <Link href="/vendor/events/create">
                                    <Plus className="size-4" />
                                    Buat Event Baru
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="default" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xs">
                                <a href={`/${vendor.username}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-4" />
                                    Halaman Publik
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Decorative ambient gradients */}
                    <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-blue-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-purple-500/15 blur-3xl" />
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {/* Total Events */}
                    <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Event</span>
                                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                    <Layers className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalEvents}</span>
                                <span className="text-xs text-neutral-500">event</span>
                            </div>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.publishedEvents}</span> aktif · {stats.draftEvents} draf · {stats.endedEvents} selesai
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tiket Terjual */}
                    <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Tiket Terjual</span>
                                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                                    <Ticket className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalTicketsSold}</span>
                                <span className="text-xs text-neutral-500">/ {stats.totalTicketsQuota || '—'} kuota</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-purple-500 transition-all duration-500"
                                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-medium text-neutral-500">{occupancyRate}%</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estimasi Pendapatan */}
                    <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Estimasi Pendapatan</span>
                                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {stats.estimatedRevenue}
                                </span>
                            </div>
                            <p className="mt-2 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                                <CheckCircle2 className="size-3 text-emerald-500" />
                                Akumulasi total transaksi tiket
                            </p>
                        </CardContent>
                    </Card>

                    {/* Kupon Promo */}
                    <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-all hover:shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Kupon Promo</span>
                                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                    <Tag className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.activeCouponsCount}</span>
                                <span className="text-xs text-neutral-500">kupon aktif</span>
                            </div>
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">{stats.totalCouponsUsed}</span> kali kupon digunakan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Recent Events (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-lg font-bold">Event Terbaru</CardTitle>
                                    <CardDescription>Event yang baru saja dibuat atau diedit</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                    <Link href="/vendor/events">
                                        Lihat Semua
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </CardHeader>

                            <CardContent className="p-0">
                                {recentEvents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                        <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                                            <Calendar className="size-6 text-neutral-400" />
                                        </div>
                                        <h4 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                            Belum Ada Event
                                        </h4>
                                        <p className="mt-1 max-w-sm text-xs text-neutral-500">
                                            Mulai promosikan acara online, offline, atau hybrid Anda dengan membuat event pertama.
                                        </p>
                                        <Button asChild size="sm" className="mt-4 gap-2">
                                            <Link href="/vendor/events/create">
                                                <Plus className="size-4" />
                                                Buat Event Sekarang
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {recentEvents.map((event) => {
                                            const isOnline = event.event_type === 'online';
                                            const isHybrid = event.event_type === 'hybrid';
                                            const isEnded = event.status === 'ended' || (event.status !== 'draft' && new Date(event.end_date_time) < new Date());
                                            const displayStatus = event.status === 'draft' ? 'draft' : isEnded ? 'ended' : event.status;

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        {/* Thumbnail */}
                                                        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                                            {event.banner_image ? (
                                                                <img
                                                                    src={event.banner_image}
                                                                    alt={event.title}
                                                                    className="size-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex size-full items-center justify-center text-neutral-400">
                                                                    <Calendar className="size-5" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <Badge
                                                                    variant={
                                                                        displayStatus === 'published'
                                                                            ? 'default'
                                                                            : displayStatus === 'draft'
                                                                            ? 'secondary'
                                                                            : 'outline'
                                                                    }
                                                                    className={`text-[10px] capitalize ${
                                                                        displayStatus === 'ended' ? 'bg-neutral-800 text-white' : ''
                                                                    }`}
                                                                >
                                                                    {displayStatus}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-[10px] capitalize">
                                                                    {isOnline && <Video className="mr-1 size-2.5" />}
                                                                    {isHybrid && <Radio className="mr-1 size-2.5" />}
                                                                    {!isOnline && !isHybrid && <MapPin className="mr-1 size-2.5" />}
                                                                    {event.event_type}
                                                                </Badge>
                                                                <span className="text-xs text-neutral-400">·</span>
                                                                <span className="text-xs text-neutral-500">{event.category}</span>
                                                            </div>

                                                            <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1 dark:text-neutral-100 hover:text-blue-600 transition-colors">
                                                                <Link href={`/vendor/events/${event.id}`}>{event.title}</Link>
                                                            </h4>

                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="size-3 text-neutral-400" />
                                                                    {new Date(event.start_date_time).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    {isOnline ? <Globe className="size-3 text-neutral-400" /> : <MapPin className="size-3 text-neutral-400" />}
                                                                    <span className="truncate max-w-[150px]">{event.location}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Progress and Action */}
                                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                                        <div className="text-left sm:text-right">
                                                            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                                {event.tickets_sold} terjual
                                                            </div>
                                                            <span className="text-[11px] text-neutral-500">
                                                                {event.price_label}
                                                            </span>
                                                        </div>

                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={`/vendor/events/${event.id}`}>
                                                                Detail
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Format Distribusi */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 text-center">
                                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Video className="size-5" />
                                </div>
                                <div className="mt-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {stats.typeBreakdown.online}
                                </div>
                                <p className="text-xs text-neutral-500">Event Online</p>
                            </Card>

                            <Card className="border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 text-center">
                                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <MapPin className="size-5" />
                                </div>
                                <div className="mt-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {stats.typeBreakdown.offline}
                                </div>
                                <p className="text-xs text-neutral-500">Event Onsite / Offline</p>
                            </Card>

                            <Card className="border-neutral-200/80 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 text-center">
                                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                    <Radio className="size-5" />
                                </div>
                                <div className="mt-3 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {stats.typeBreakdown.hybrid}
                                </div>
                                <p className="text-xs text-neutral-500">Event Hybrid</p>
                            </Card>
                        </div>
                    </div>

                    {/* Right: Quick Actions & Coupons (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Quick Actions Card */}
                        <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">Pusat Aksi Cepat</CardTitle>
                                <CardDescription>Jalan pintas ke menu utama</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild variant="outline" className="w-full justify-start gap-2.5 h-10 text-sm font-medium">
                                    <Link href="/vendor/events/create">
                                        <Plus className="size-4 text-blue-600 dark:text-blue-400" />
                                        Buat Event Baru
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start gap-2.5 h-10 text-sm font-medium">
                                    <Link href="/vendor/events">
                                        <Layers className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        Kelola Seluruh Event
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start gap-2.5 h-10 text-sm font-medium">
                                    <Link href="/vendor/coupons">
                                        <Tag className="size-4 text-amber-600 dark:text-amber-400" />
                                        Kelola Kupon Promo
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start gap-2.5 h-10 text-sm font-medium">
                                    <Link href="/settings/profile">
                                        <CreditCard className="size-4 text-purple-600 dark:text-purple-400" />
                                        Pengaturan Profil & Akun
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Active Coupons Widget */}
                        <Card className="border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-base font-bold">Kupon Promo</CardTitle>
                                    <CardDescription>Kode promo aktif untuk pembeli</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                                    <Link href="/vendor/coupons">
                                        Kelola
                                        <ArrowRight className="size-3" />
                                    </Link>
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {recentCoupons.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-neutral-500">
                                        <Tag className="mx-auto size-6 text-neutral-400 mb-2 opacity-50" />
                                        Belum ada kupon promo aktif.
                                        <div className="mt-3">
                                            <Button asChild size="sm" variant="outline" className="text-xs">
                                                <Link href="/vendor/coupons">Buat Kupon Pertama</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    recentCoupons.map((coupon) => (
                                        <div
                                            key={coupon.id}
                                            className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                        {coupon.code}
                                                    </span>
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                                                        {coupon.discount_label}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-neutral-500">
                                                    {coupon.usage_count} dipakai {coupon.usage_limit ? `dari ${coupon.usage_limit}` : ''}
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopy(coupon.code)}
                                                className="size-8 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                                                title="Salin kode kupon"
                                            >
                                                {copiedCode === coupon.code ? (
                                                    <Check className="size-3.5 text-emerald-500" />
                                                ) : (
                                                    <Copy className="size-3.5" />
                                                )}
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
