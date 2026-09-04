import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Copy,
    Edit3,
    ExternalLink,
    Globe,
    Layers,
    MapPin,
    Mic,
    Radio,
    Share2,
    Ticket,
    Trash2,
    Users,
    Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { EventItem, EventStatus } from '@/types/event';

interface Props {
    event: EventItem;
}

export default function VendorEventShow({ event }: Props) {
    const [copiedLink, setCopiedLink] = useState(false);

    const isOnline = event.event_type === 'online';
    const isOffline = event.event_type === 'offline';
    const isHybrid = event.event_type === 'hybrid';
    const isPublished = event.status === 'published';

    const handleCopyStreamingLink = () => {
        if (event.streaming_link) {
            navigator.clipboard.writeText(event.streaming_link);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    const handleToggleStatus = () => {
        const nextStatus: EventStatus = isPublished ? 'draft' : 'published';
        router.patch(`/vendor/events/${event.id}/status`, {
            status: nextStatus,
        });
    };

    const handleDuplicate = () => {
        if (confirm(`Duplikasi event "${event.title}"?`)) {
            router.post(`/vendor/events/${event.id}/duplicate`);
        }
    };

    const handleDelete = () => {
        if (confirm(`Yakin ingin menghapus event ini secara permanen?`)) {
            router.delete(`/vendor/events/${event.id}`);
        }
    };

    const totalTicketsQuota = event.tickets.reduce((acc, t) => acc + t.quantity, 0);
    const totalTicketsSold = event.tickets.reduce((acc, t) => acc + (t.quantity_sold ?? 0), 0);
    const salesProgressPercent = totalTicketsQuota > 0 ? Math.round((totalTicketsSold / totalTicketsQuota) * 100) : 0;

    return (
        <>
            <Head title={`Detail Event: ${event.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Top Action Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="icon" className="size-9 rounded-full">
                            <Link href="/vendor/events">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={isPublished ? 'default' : 'secondary'}
                                    className="capitalize text-[11px]"
                                >
                                    {event.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize text-[11px]">
                                    {event.event_type}
                                </Badge>
                                <span className="text-xs text-neutral-500">• {event.category?.name}</span>
                            </div>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToggleStatus}
                            className="text-xs"
                        >
                            <Radio className="mr-1.5 size-3.5" />
                            {isPublished ? 'Ubah ke Draft' : 'Publikasikan'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDuplicate}
                            className="text-xs"
                        >
                            <Copy className="mr-1.5 size-3.5" />
                            Duplikasi
                        </Button>
                        <Button asChild size="sm" className="text-xs gap-1.5 shadow-xs">
                            <Link href={`/vendor/events/${event.id}/edit`}>
                                <Edit3 className="size-3.5" />
                                Edit Event
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Banner & Quick Summary */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner Card */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 dark:border-neutral-800">
                            {event.banner_image ? (
                                <img
                                    src={event.banner_image}
                                    alt={event.title}
                                    className="aspect-video w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 p-8 text-center text-white">
                                    <div>
                                        <Calendar className="mx-auto size-12 opacity-30 mb-2" />
                                        <h3 className="text-lg font-bold">{event.title}</h3>
                                        <p className="mt-1 text-xs text-neutral-400">{event.category?.name ?? 'Event'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deskripsi & Informasi Event</CardTitle>
                                {event.summary && <CardDescription>{event.summary}</CardDescription>}
                            </CardHeader>
                            <CardContent>
                                {event.description ? (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 leading-relaxed
                                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-neutral-900 dark:[&_h2]:text-neutral-100 [&_h2]:mt-4 [&_h2]:mb-2
                                            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-neutral-900 dark:[&_h3]:text-neutral-100 [&_h3]:mt-3 [&_h3]:mb-1.5
                                            [&_p]:mb-3
                                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
                                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
                                            [&_blockquote]:border-l-4 [&_blockquote]:border-[#C1502E] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-neutral-600 dark:[&_blockquote]:text-neutral-400
                                            [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: event.description }}
                                    />
                                ) : (
                                    <p className="text-sm text-neutral-500">Belum ada deskripsi lengkap yang ditambahkan.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Rundown Timeline Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Rundown & Agenda Acara</CardTitle>
                                        <CardDescription>{event.agendas?.length ?? 0} sesi terdaftar</CardDescription>
                                    </div>
                                    <Clock className="size-5 text-neutral-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {!event.agendas || event.agendas.length === 0 ? (
                                    <p className="text-sm text-neutral-500">Belum ada sesi rundown.</p>
                                ) : (
                                    <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 space-y-6 py-2">
                                        {event.agendas.map((agenda, i) => (
                                            <div key={agenda.id ?? i} className="relative pl-6">
                                                <div className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-white bg-blue-600 dark:border-neutral-900" />
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                        {agenda.start_time.slice(0, 5)} - {agenda.end_time.slice(0, 5)} WIB
                                                    </span>
                                                    {agenda.stage_or_room && (
                                                        <Badge variant="outline" className="text-[10px]">
                                                            {agenda.stage_or_room}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h4 className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {agenda.title}
                                                </h4>
                                                {agenda.speaker_name && (
                                                    <p className="mt-0.5 text-xs text-neutral-500">
                                                        Pembicara: <span className="font-medium text-neutral-700 dark:text-neutral-300">{agenda.speaker_name}</span>
                                                    </p>
                                                )}
                                                {agenda.description && (
                                                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                                        {agenda.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Speakers Section */}
                        {event.speakers && event.speakers.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daftar Pembicara ({event.speakers.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {event.speakers.map((spk, idx) => (
                                            <div
                                                key={spk.id ?? idx}
                                                className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
                                            >
                                                <div className="size-12 shrink-0 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                    {spk.avatar && typeof spk.avatar === 'string' ? (
                                                        <img src={spk.avatar} alt={spk.name} className="size-full object-cover" />
                                                    ) : (
                                                        <div className="flex size-full items-center justify-center font-bold text-neutral-400">
                                                            {spk.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                                                        {spk.name}
                                                    </h4>
                                                    <p className="text-xs text-neutral-500 truncate">
                                                        {spk.role_or_title}
                                                        {spk.organization && ` • ${spk.organization}`}
                                                    </p>
                                                    {spk.bio && (
                                                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                                            {spk.bio}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Sponsors Section */}
                        {event.sponsors && event.sponsors.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sponsor & Partner ({event.sponsors.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {event.sponsors.map((sps, idx) => (
                                            <div
                                                key={sps.id ?? idx}
                                                className="flex items-center gap-2.5 rounded-lg border border-neutral-200 px-3.5 py-2 dark:border-neutral-800"
                                            >
                                                {sps.logo && typeof sps.logo === 'string' && (
                                                    <img src={sps.logo} alt={sps.name} className="size-6 object-contain" />
                                                )}
                                                <div>
                                                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {sps.name}
                                                    </span>
                                                    <span className="block text-[10px] text-neutral-400 uppercase font-mono">
                                                        {sps.tier}
                                                    </span>
                                                </div>
                                                {sps.website_url && (
                                                    <a
                                                        href={sps.website_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Key Details, Location / Stream, Tickets */}
                    <div className="space-y-6">
                        {/* Waktu & Tanggal Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Waktu & Jadwal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <Calendar className="size-4 shrink-0 text-neutral-400 mt-0.5" />
                                    <div>
                                        <span className="block font-medium text-neutral-900 dark:text-neutral-100">
                                            {new Date(event.start_date_time).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            {new Date(event.start_date_time).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}{' '}
                                            -{' '}
                                            {new Date(event.end_date_time).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}{' '}
                                            ({event.timezone})
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Format: Streaming (Online/Hybrid) */}
                        {(isOnline || isHybrid) && (
                            <Card className="border-blue-200/80 bg-blue-50/40 dark:border-blue-900/50 dark:bg-blue-950/20">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base text-blue-950 dark:text-blue-100">
                                            Online Streaming Link
                                        </CardTitle>
                                        <Video className="size-4 text-blue-600" />
                                    </div>
                                    <CardDescription className="text-xs text-blue-800/80 dark:text-blue-300/80">
                                        Platform: {event.online_platform || 'Online Webinar'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    {event.streaming_link ? (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    readOnly
                                                    value={event.streaming_link}
                                                    className="font-mono text-xs bg-white dark:bg-neutral-900"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCopyStreamingLink}
                                                    className="shrink-0"
                                                >
                                                    {copiedLink ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                                                </Button>
                                            </div>
                                            {event.streaming_instructions && (
                                                <div className="mt-2.5 rounded-lg bg-white/80 p-2.5 text-xs text-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300">
                                                    <span className="font-semibold block mb-0.5">Petunjuk Gabung:</span>
                                                    {event.streaming_instructions}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-neutral-500">Belum ada link streaming yang dimasukkan.</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Format: Offline Venue (Offline/Hybrid) */}
                        {(isOffline || isHybrid) && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Lokasi Venue</CardTitle>
                                        <MapPin className="size-4 text-neutral-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {event.venue_name || 'Venue Belum Ditentukan'}
                                        </h4>
                                        {event.address && (
                                            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                                {event.address}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-xs text-neutral-500">
                                            {event.city}
                                            {event.province && `, ${event.province}`}
                                        </p>
                                    </div>

                                    {event.google_maps_url && (
                                        <Button asChild variant="outline" size="sm" className="w-full gap-2 text-xs">
                                            <a href={event.google_maps_url} target="_blank" rel="noreferrer">
                                                <MapPin className="size-3.5 text-red-500" />
                                                Buka di Google Maps
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Ticket Tier Breakdown */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Konfigurasi Tiket</CardTitle>
                                    <Ticket className="size-4 text-neutral-400" />
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                        <span>Penjualan Tiket</span>
                                        <span>
                                            {totalTicketsSold} / {totalTicketsQuota} ({salesProgressPercent}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all"
                                            style={{ width: `${Math.min(100, salesProgressPercent)}%` }}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {event.tickets.map((t, idx) => (
                                    <div
                                        key={t.id ?? idx}
                                        className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800 space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                                                {t.name}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] uppercase">
                                                {t.tier}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                                {t.type === 'free'
                                                    ? 'Gratis'
                                                    : `Rp ${new Intl.NumberFormat('id-ID').format(t.price)}`}
                                            </span>
                                            <span className="text-neutral-500">
                                                Kuota: {t.quantity} tiket
                                            </span>
                                        </div>
                                        {t.description && (
                                            <p className="text-[11px] text-neutral-500 line-clamp-1">{t.description}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
