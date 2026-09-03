import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar,
    Clock,
    Copy,
    Edit3,
    Eye,
    Globe,
    Layers,
    MapPin,
    MoreHorizontal,
    Plus,
    Radio,
    Search,
    Tag,
    Ticket,
    Trash2,
    TrendingUp,
    Video,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { EventItem, EventStatus, EventType } from '@/types/event';

interface PaginatedEvents {
    data: EventItem[];
    current_page: number;
    last_page: number;
    total: number;
    next_page_url?: string | null;
    prev_page_url?: string | null;
}

interface Props {
    events: PaginatedEvents;
    stats: {
        totalEvents: number;
        publishedEvents: number;
        draftEvents: number;
        endedEvents?: number;
        totalTicketsSold: number;
        estimatedRevenue: string;
    };
    filters: {
        status: string;
        type: string;
        search: string;
    };
}

export default function VendorEventsIndex({ events, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const isFiltered = filters.status !== 'all' || filters.type !== 'all' || Boolean(filters.search);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/vendor/events',
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const handleClearSearch = () => {
        setSearch('');
        handleFilterChange('search', '');
    };

    const handleResetFilters = () => {
        setSearch('');
        router.get(
            '/vendor/events',
            {
                status: 'all',
                type: 'all',
                search: '',
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDuplicate = (event: EventItem) => {
        if (confirm(`Duplikasi event "${event.title}"?`)) {
            router.post(`/vendor/events/${event.id}/duplicate`);
        }
    };

    const handleToggleStatus = (event: EventItem) => {
        const nextStatus: EventStatus = event.status === 'published' ? 'draft' : 'published';
        router.patch(`/vendor/events/${event.id}/status`, {
            status: nextStatus,
        });
    };

    const handleDelete = (event: EventItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus event "${event.title}"? Semua tiket dan agenda terkait akan terhapus.`)) {
            router.delete(`/vendor/events/${event.id}`);
        }
    };

    const formatPrice = (tickets: EventItem['tickets']) => {
        if (!tickets || tickets.length === 0) return 'Belum ada tiket';
        const minPrice = Math.min(...tickets.map((t) => Number(t.price)));
        if (minPrice === 0) return 'Gratis';
        return `Mulai Rp ${new Intl.NumberFormat('id-ID').format(minPrice)}`;
    };

    return (
        <>
            <Head title="Manajemen Event" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl">
                            Manajemen Event
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Kelola jadwal, tiket, rundown agenda, pembicara, dan sponsor event Anda.
                        </p>
                    </div>
                    <Button asChild size="lg" className="gap-2 shadow-sm">
                        <Link href="/vendor/events/create">
                            <Plus className="size-4" />
                            Buat Event Baru
                        </Link>
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-xs">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Event</span>
                                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                    <Layers className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalEvents}</span>
                                <span className="text-xs text-neutral-500">terdaftar</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-xs">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Event Aktif</span>
                                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                    <Radio className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.publishedEvents}</span>
                                <span className="text-xs text-neutral-500">publik ({stats.draftEvents} draft)</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-xs">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Tiket Terjual</span>
                                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                                    <Ticket className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalTicketsSold}</span>
                                <span className="text-xs text-neutral-500">tiket</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-xs">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Estimasi Omset</span>
                                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                    <TrendingUp className="size-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{stats.estimatedRevenue}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            placeholder="Cari judul event, lokasi, kota..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-9 pl-9"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filters */}
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100/60 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                            {(['all', 'published', 'draft', 'ended'] as const).map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleFilterChange('status', st)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                                        filters.status === st
                                            ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                    }`}
                                >
                                    {st === 'all' ? 'Semua Status' : st}
                                </button>
                            ))}
                        </div>

                        {/* Type Filters */}
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100/60 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                            {(['all', 'offline', 'online', 'hybrid'] as const).map((tp) => (
                                <button
                                    key={tp}
                                    type="button"
                                    onClick={() => handleFilterChange('type', tp)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                                        filters.type === tp
                                            ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                    }`}
                                >
                                    {tp === 'all' ? 'Semua Tipe' : tp}
                                </button>
                            ))}
                        </div>

                        {/* Reset Filter Button */}
                        {isFiltered && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                                className="h-8 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            >
                                <X className="mr-1 size-3.5" />
                                Reset Filter
                            </Button>
                        )}
                    </div>
                </div>

                {/* Event Cards Grid */}
                {events.data.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
                        <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-900">
                            <Calendar className="size-8 text-neutral-400" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            Tidak ada event ditemukan
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                            {filters.search || filters.status !== 'all' || filters.type !== 'all'
                                ? 'Coba ubah kata kunci pencarian atau filter yang Anda pilih.'
                                : 'Anda belum membuat event. Buat event pertama Anda sekarang juga.'}
                        </p>
                        <Button asChild className="mt-6 gap-2">
                            <Link href="/vendor/events/create">
                                <Plus className="size-4" />
                                Buat Event Baru
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((event) => {
                            const isOnline = event.event_type === 'online';
                            const isHybrid = event.event_type === 'hybrid';
                            const isEnded = event.status === 'ended' || (event.status !== 'draft' && event.status !== 'cancelled' && new Date(event.end_date_time) < new Date());
                            const displayStatus = isEnded ? 'ended' : event.status;
                            const isPublished = displayStatus === 'published';

                            return (
                                <Card
                                    key={event.id}
                                    className="group overflow-hidden border-neutral-200/80 bg-white transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {/* Event Banner */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700">
                                        {event.banner_image ? (
                                            <img
                                                src={event.banner_image}
                                                alt={event.title}
                                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex size-full flex-col items-center justify-center p-4 text-center text-white/80">
                                                <Calendar className="size-8 opacity-40 mb-1" />
                                                <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                                                    {event.category?.name ?? 'Event'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Status & Type Badges */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <Badge
                                                variant={
                                                    displayStatus === 'published'
                                                        ? 'default'
                                                        : displayStatus === 'draft'
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                className={`text-[11px] capitalize ${
                                                    displayStatus === 'ended' ? 'bg-neutral-800/85 text-white border-white/20 backdrop-blur-xs' : ''
                                                }`}
                                            >
                                                {displayStatus}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-black/60 text-white backdrop-blur-xs text-[11px] border-white/20 capitalize"
                                            >
                                                {isOnline && <Video className="mr-1 size-3" />}
                                                {isHybrid && <Radio className="mr-1 size-3" />}
                                                {!isOnline && !isHybrid && <MapPin className="mr-1 size-3" />}
                                                {event.event_type}
                                            </Badge>
                                        </div>

                                        {/* Dropdown Action */}
                                        <div className="absolute top-3 right-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="size-8 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs border border-white/10"
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/vendor/events/${event.id}`} className="cursor-pointer">
                                                            <Eye className="mr-2 size-4" />
                                                            Lihat Detail
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/vendor/events/${event.id}/edit`} className="cursor-pointer">
                                                            <Edit3 className="mr-2 size-4" />
                                                            Edit Event
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(event)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Radio className="mr-2 size-4" />
                                                        {isPublished ? 'Jadikan Draft' : 'Publikasikan'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDuplicate(event)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Copy className="mr-2 size-4" />
                                                        Duplikasi
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(event)}
                                                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Hapus Event
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex flex-col p-4">
                                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                            <Tag className="size-3.5" />
                                            <span>{event.category?.name ?? 'Event'}</span>
                                        </div>

                                        <h3 className="mt-1.5 text-base font-semibold text-neutral-900 line-clamp-1 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Link href={`/vendor/events/${event.id}`}>{event.title}</Link>
                                        </h3>

                                        <div className="mt-3 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3.5 text-neutral-400" />
                                                <span>
                                                    {new Date(event.start_date_time).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <Clock className="size-3.5 ml-2 text-neutral-400" />
                                                <span>
                                                    {new Date(event.start_date_time).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}{' '}
                                                    WIB
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 line-clamp-1">
                                                {isOnline ? (
                                                    <>
                                                        <Globe className="size-3.5 shrink-0 text-neutral-400" />
                                                        <span className="truncate">{event.online_platform ?? 'Streaming Online'}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="size-3.5 shrink-0 text-neutral-400" />
                                                        <span className="truncate">
                                                            {event.venue_name ?? event.city ?? 'Lokasi onsite'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                                                    Harga Tiket
                                                </span>
                                                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                    {formatPrice(event.tickets)}
                                                </p>
                                            </div>

                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/vendor/events/${event.id}`}>Detail</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {events.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
                        <span className="text-xs text-neutral-500">
                            Menampilkan halaman {events.current_page} dari {events.last_page} ({events.total} total event)
                        </span>
                        <div className="flex gap-2">
                            {events.prev_page_url && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={events.prev_page_url} preserveState>
                                        Sebelumnya
                                    </Link>
                                </Button>
                            )}
                            {events.next_page_url && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={events.next_page_url} preserveState>
                                        Selanjutnya
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
