import { Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Globe,
    Layers,
    MapPin,
    Mic,
    Plus,
    Radio,
    RefreshCw,
    ShieldAlert,
    Trash2,
    UploadCloud,
    Users,
    Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Textarea } from '@/components/ui/textarea';
import type {
    Category,
    EventAgenda,
    EventItem,
    EventSpeaker,
    EventSponsor,
    EventStatus,
    EventTicket,
    EventType,
    SponsorTier,
    TicketTier,
} from '@/types/event';

interface Props {
    categories: Category[];
    event?: EventItem;
    isEditing?: boolean;
}

export function EventForm({ categories, event, isEditing = false }: Props) {
    const [activeTab, setActiveTab] = useState<'basic' | 'format' | 'schedule' | 'tickets' | 'agenda' | 'speakers' | 'sponsors'>('basic');

    const formatDateTimeForInput = (dateTimeStr?: string | null) => {
        if (!dateTimeStr) return '';
        const d = new Date(dateTimeStr);
        if (isNaN(d.getTime())) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const defaultTickets: EventTicket[] = event?.tickets && event.tickets.length > 0
        ? event.tickets.map((t) => ({
              ...t,
              sale_start_date: formatDateTimeForInput(t.sale_start_date),
              sale_end_date: formatDateTimeForInput(t.sale_end_date),
          }))
        : [
              {
                  name: 'Regular Pass',
                  type: 'paid',
                  tier: 'regular',
                  price: 150000,
                  quantity: 100,
                  min_per_transaction: 1,
                  max_per_transaction: 5,
                  sale_start_date: '',
                  sale_end_date: '',
                  description: 'Akses penuh ke seluruh rangkaian acara.',
              },
          ];

    const defaultAgendas: EventAgenda[] = event?.agendas && event.agendas.length > 0
        ? event.agendas
        : [
              {
                  title: 'Opening & Registrasi',
                  start_time: '09:00',
                  end_time: '10:00',
                  speaker_name: 'MC / Host',
                  stage_or_room: 'Main Hall',
                  description: 'Pendaftaran ulang peserta dan sambutan pembuka.',
                  order: 1,
              },
          ];

    const defaultSpeakers: EventSpeaker[] = event?.speakers && event.speakers.length > 0
        ? event.speakers
        : [];

    const defaultSponsors: EventSponsor[] = event?.sponsors && event.sponsors.length > 0
        ? event.sponsors
        : [];

    const [previewUrl, setPreviewUrl] = useState<string | null>(event?.banner_image ?? null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors } = useForm<{
        title: string;
        category_id: number;
        summary: string;
        description: string;
        banner_image: File | string | null;
        event_type: EventType;
        status: EventStatus;
        start_date_time: string;
        end_date_time: string;
        timezone: string;
        online_platform: string;
        streaming_link: string;
        streaming_instructions: string;
        venue_name: string;
        address: string;
        city: string;
        province: string;
        latitude: number | null;
        longitude: number | null;
        google_maps_url: string;
        tickets: EventTicket[];
        agendas: EventAgenda[];
        speakers: EventSpeaker[];
        sponsors: EventSponsor[];
    }>({
        title: event?.title ?? '',
        category_id: event?.category_id ?? (categories[0]?.id ?? 1),
        summary: event?.summary ?? '',
        description: event?.description ?? '',
        banner_image: event?.banner_image ?? null,
        event_type: (event?.event_type ?? 'offline') as EventType,
        status: (event?.status ?? 'published') as EventStatus,
        start_date_time: formatDateTimeForInput(event?.start_date_time) || '2026-10-15T09:00',
        end_date_time: formatDateTimeForInput(event?.end_date_time) || '2026-10-15T17:00',
        timezone: event?.timezone ?? 'Asia/Jakarta',

        // Online attributes
        online_platform: event?.online_platform ?? 'Zoom Meetings',
        streaming_link: event?.streaming_link ?? '',
        streaming_instructions: event?.streaming_instructions ?? '',

        // Offline attributes
        venue_name: event?.venue_name ?? '',
        address: event?.address ?? '',
        city: event?.city ?? 'Jakarta',
        province: event?.province ?? 'DKI Jakarta',
        latitude: event?.latitude ?? null,
        longitude: event?.longitude ?? null,
        google_maps_url: event?.google_maps_url ?? '',

        // Relational repeaters
        tickets: defaultTickets,
        agendas: defaultAgendas,
        speakers: defaultSpeakers,
        sponsors: defaultSponsors,
    });

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    const handleFileSelect = (file: File | undefined | null) => {
        if (!file) return;

        // Client-side validation: Max 10MB
        if (file.size > MAX_FILE_SIZE) {
            setFileError('Ukuran foto terlalu besar. Maksimal 10MB.');
            toast.error('Ukuran foto terlalu besar. Maksimal 10MB.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Allowed types check
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setFileError('Format file tidak didukung. Harap upload format JPG, PNG, atau WEBP.');
            toast.error('Format file tidak didukung. Harap upload format JPG, PNG, atau WEBP.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setFileError(null);
        setData('banner_image', file);

        const formattedSize = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

        setSelectedFileMeta({
            name: file.name,
            size: formattedSize,
        });

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveBanner = () => {
        setData('banner_image', null);
        setPreviewUrl(null);
        setSelectedFileMeta(null);
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation check for banner
        if (data.banner_image instanceof File && data.banner_image.size > MAX_FILE_SIZE) {
            setFileError('Ukuran foto terlalu besar. Maksimal 10MB.');
            toast.error('Ukuran foto terlalu besar. Maksimal 10MB.');
            alert('Ukuran foto terlalu besar. Maksimal 10MB.');
            setActiveTab('basic');
            return;
        }

        // Client-side validation check for speaker avatars
        for (let i = 0; i < data.speakers.length; i++) {
            const avatar = data.speakers[i].avatar;
            if (avatar instanceof File && avatar.size > MAX_FILE_SIZE) {
                toast.error(`Ukuran foto avatar pembicara #${i + 1} terlalu besar. Maksimal 10MB.`);
                alert(`Ukuran foto avatar pembicara #${i + 1} terlalu besar. Maksimal 10MB.`);
                setActiveTab('speakers');
                return;
            }
        }

        // Client-side validation check for sponsor logos
        for (let i = 0; i < data.sponsors.length; i++) {
            const logo = data.sponsors[i].logo;
            if (logo instanceof File && logo.size > MAX_FILE_SIZE) {
                toast.error(`Ukuran logo sponsor #${i + 1} terlalu besar. Maksimal 10MB.`);
                alert(`Ukuran logo sponsor #${i + 1} terlalu besar. Maksimal 10MB.`);
                setActiveTab('sponsors');
                return;
            }
        }

        const hasAnyFileUpload =
            data.banner_image instanceof File ||
            data.speakers.some((s) => s.avatar instanceof File) ||
            data.sponsors.some((s) => s.logo instanceof File);

        if (isEditing && event) {
            if (hasAnyFileUpload) {
                router.post(`/vendor/events/${event.id}`, {
                    ...data,
                    _method: 'put',
                } as any);
            } else {
                put(`/vendor/events/${event.id}`);
            }
        } else {
            post('/vendor/events');
        }
    };

    // Ticket repeater helpers
    const addTicket = () => {
        setData('tickets', [
            ...data.tickets,
            {
                name: 'VIP Pass',
                type: 'paid',
                tier: 'vip',
                price: 350000,
                quantity: 50,
                min_per_transaction: 1,
                max_per_transaction: 5,
                sale_start_date: '',
                sale_end_date: '',
                description: 'Akses khusus baris terdepan, exclusive goodie bag & sertifikat.',
            },
        ]);
    };

    const removeTicket = (index: number) => {
        if (data.tickets.length <= 1) {
            alert('Event harus memiliki minimal satu konfigurasi tiket.');
            return;
        }
        setData('tickets', data.tickets.filter((_, i) => i !== index));
    };

    const updateTicket = (index: number, field: keyof EventTicket, value: any) => {
        const newTickets = [...data.tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        if (field === 'type' && value === 'free') {
            newTickets[index].price = 0;
        }
        setData('tickets', newTickets);
    };

    // Agenda repeater helpers
    const addAgenda = () => {
        setData('agendas', [
            ...data.agendas,
            {
                title: 'Sesi Diskusi Panel',
                start_time: '13:00',
                end_time: '14:30',
                speaker_name: '',
                stage_or_room: 'Main Hall',
                description: '',
                order: data.agendas.length + 1,
            },
        ]);
    };

    const removeAgenda = (index: number) => {
        setData('agendas', data.agendas.filter((_, i) => i !== index));
    };

    const updateAgenda = (index: number, field: keyof EventAgenda, value: any) => {
        const newAgendas = [...data.agendas];
        newAgendas[index] = { ...newAgendas[index], [field]: value };
        setData('agendas', newAgendas);
    };

    // Speaker repeater helpers
    const addSpeaker = () => {
        setData('speakers', [
            ...data.speakers,
            {
                name: '',
                role_or_title: '',
                organization: '',
                bio: '',
                avatar: '',
                social_links: { linkedin: '', twitter: '', instagram: '', website: '' },
                order: data.speakers.length + 1,
            },
        ]);
    };

    const removeSpeaker = (index: number) => {
        setData('speakers', data.speakers.filter((_, i) => i !== index));
    };

    const updateSpeaker = (index: number, field: keyof EventSpeaker, value: any) => {
        const newSpeakers = [...data.speakers];
        newSpeakers[index] = { ...newSpeakers[index], [field]: value };
        setData('speakers', newSpeakers);
    };

    // Sponsor repeater helpers
    const addSponsor = () => {
        setData('sponsors', [
            ...data.sponsors,
            {
                name: '',
                tier: 'gold',
                logo: '',
                website_url: '',
                order: data.sponsors.length + 1,
            },
        ]);
    };

    const removeSponsor = (index: number) => {
        setData('sponsors', data.sponsors.filter((_, i) => i !== index));
    };

    const updateSponsor = (index: number, field: keyof EventSponsor, value: any) => {
        const newSponsors = [...data.sponsors];
        newSponsors[index] = { ...newSponsors[index], [field]: value };
        setData('sponsors', newSponsors);
    };

    const isOnline = data.event_type === 'online';
    const isOffline = data.event_type === 'offline';
    const isHybrid = data.event_type === 'hybrid';

    const tabs = [
        { id: 'basic', label: '1. Info Dasar', icon: Layers },
        { id: 'format', label: '2. Format & Lokasi', icon: MapPin },
        { id: 'schedule', label: '3. Waktu & Tanggal', icon: Calendar },
        { id: 'tickets', label: `4. Tiket (${data.tickets.length})`, icon: DollarSign },
        { id: 'agenda', label: `5. Rundown (${data.agendas.length})`, icon: Clock },
        { id: 'speakers', label: `6. Pembicara (${data.speakers.length})`, icon: Mic },
        { id: 'sponsors', label: `7. Sponsor (${data.sponsors.length})`, icon: Globe },
    ] as const;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Bar Navigation Tabs */}
            <div className="no-scrollbar flex overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-100/70 p-1.5 dark:border-neutral-800 dark:bg-neutral-900">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                                isActive
                                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                            }`}
                        >
                            <Icon className="size-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: INFORMASI DASAR */}
            {activeTab === 'basic' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar Event</CardTitle>
                        <CardDescription>
                            Tentukan judul, kategori, dan deskripsi komprehensif untuk menarik calon peserta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <Label htmlFor="title">Judul Event *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Jakarta International Music Festival 2026"
                                className="mt-1.5"
                                required
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <Label htmlFor="category_id">Kategori Event *</Label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', Number(e.target.value))}
                                    className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="status">Status Publikasi *</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as EventStatus)}
                                    className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300"
                                >
                                    <option value="published">Published (Tayang ke Publik)</option>
                                    <option value="draft">Draft (Simpan Sementara)</option>
                                    <option value="ended">Ended (Telah Selesai)</option>
                                    <option value="cancelled">Cancelled (Dibatalkan)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="summary">Ringkasan Singkat</Label>
                            <Input
                                id="summary"
                                value={data.summary}
                                onChange={(e) => setData('summary', e.target.value)}
                                placeholder="1-2 kalimat pemikat yang akan tampil di kartu event..."
                                className="mt-1.5"
                            />
                            {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <Label htmlFor="description">Deskripsi Lengkap Event</Label>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Dukungan Rich Text (Tebal, Miring, Heading, Poin, Link)</span>
                            </div>
                            <RichTextEditor
                                value={data.description}
                                onChange={(val) => setData('description', val)}
                                placeholder="Jelaskan gambaran umum, daya tarik utama, syarat & ketentuan, serta apa saja yang akan didapatkan peserta..."
                                minHeight="220px"
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="banner_image" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Banner / Gambar Poster Event
                                </Label>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Rekomendasi Rasio 16:9
                                </span>
                            </div>

                            {/* Hidden native file input */}
                            <input
                                ref={fileInputRef}
                                id="banner_image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />

                            {!previewUrl ? (
                                /* Interactive Drag & Drop Area */
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                                        isDragging
                                            ? 'border-neutral-900 bg-neutral-900/5 dark:border-neutral-100 dark:bg-neutral-100/10 scale-[1.01] ring-2 ring-neutral-900 dark:ring-neutral-100'
                                            : 'border-neutral-300 bg-neutral-50/70 hover:border-neutral-400 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/80'
                                    }`}
                                >
                                    <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 group-hover:scale-110 dark:bg-neutral-800">
                                        <UploadCloud className="size-7 text-neutral-600 dark:text-neutral-300" />
                                    </div>
                                    <div className="mt-3.5 space-y-1">
                                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                            <span className="text-neutral-900 underline underline-offset-4 dark:text-neutral-100">Klik untuk upload</span> atau drag & drop gambar ke sini
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            Format: JPG/PNG/WEBP. Rekomendasi Rasio 16:9. Maksimal 10MB.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Interactive 16:9 Preview Card */
                                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                                        <img
                                            src={previewUrl}
                                            alt="Preview Banner"
                                            className="size-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                                        {/* Aspect ratio badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-0 text-xs font-normal">
                                                Preview Rasio 16:9
                                            </Badge>
                                        </div>

                                        {/* Action buttons on top-right */}
                                        <div className="absolute top-3 right-3 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 gap-1.5 bg-white/90 text-neutral-900 shadow-sm backdrop-blur-md hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-900"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                            >
                                                <RefreshCw className="size-3.5" />
                                                Ganti Foto
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 gap-1.5 bg-red-600/90 text-white shadow-sm backdrop-blur-md hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveBanner();
                                                }}
                                            >
                                                <Trash2 className="size-3.5" />
                                                Hapus
                                            </Button>
                                        </div>

                                        {/* File metadata footer inside image preview */}
                                        {selectedFileMeta && (
                                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md">
                                                <span className="font-medium truncate max-w-[70%]">{selectedFileMeta.name}</span>
                                                <span className="rounded-md bg-black/50 px-2 py-0.5 backdrop-blur-xs">{selectedFileMeta.size}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Helper text under preview */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-neutral-100 px-4 py-2.5 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 text-xs text-neutral-500 dark:text-neutral-400">
                                        <span>Format: JPG/PNG/WEBP. Rekomendasi Rasio 16:9. Maksimal 10MB.</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Auto-fit & kompresi server aktif</span>
                                    </div>
                                </div>
                            )}

                            {/* Client-side validation warning */}
                            {fileError && (
                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>{fileError}</span>
                                </div>
                            )}

                            {/* Backend validation error */}
                            {errors.banner_image && (
                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>{errors.banner_image}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" onClick={() => setActiveTab('format')}>
                                Lanjut ke Format & Lokasi &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 2: FORMAT & LOKASI */}
            {activeTab === 'format' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Format Acara & Lokasi</CardTitle>
                        <CardDescription>
                            Pilih apakah acara berlangsung secara offline, online streaming, atau kombinasi keduanya (hybrid).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Event Type Selector Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div
                                onClick={() => setData('event_type', 'offline')}
                                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                    data.event_type === 'offline'
                                        ? 'border-neutral-900 bg-neutral-900/5 dark:border-neutral-100 dark:bg-neutral-100/10 ring-2 ring-neutral-900 dark:ring-neutral-100'
                                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-5 text-neutral-900 dark:text-neutral-100" />
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Offline (Tatap Muka)</span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    Peserta menghadiri venue fisik dengan navigasi Google Maps terintegrasi.
                                </p>
                            </div>

                            <div
                                onClick={() => setData('event_type', 'online')}
                                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                    data.event_type === 'online'
                                        ? 'border-neutral-900 bg-neutral-900/5 dark:border-neutral-100 dark:bg-neutral-100/10 ring-2 ring-neutral-900 dark:ring-neutral-100'
                                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Video className="size-5 text-blue-600 dark:text-blue-400" />
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Online (Virtual)</span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    Streaming via Zoom, Google Meet, atau link video interaktif terproteksi.
                                </p>
                            </div>

                            <div
                                onClick={() => setData('event_type', 'hybrid')}
                                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                    data.event_type === 'hybrid'
                                        ? 'border-neutral-900 bg-neutral-900/5 dark:border-neutral-100 dark:bg-neutral-100/10 ring-2 ring-neutral-900 dark:ring-neutral-100'
                                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Radio className="size-5 text-purple-600 dark:text-purple-400" />
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Hybrid (Gabungan)</span>
                                </div>
                                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    Menyediakan tiket hadir onsite di tempat sekaligus streaming bagi peserta daring.
                                </p>
                            </div>
                        </div>

                        {/* Online Streaming Section */}
                        {(isOnline || isHybrid) && (
                            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Video className="size-4 text-blue-600 dark:text-blue-400" />
                                    <h4 className="text-sm font-semibold text-blue-950 dark:text-blue-200">
                                        Konfigurasi Online Streaming Terproteksi
                                    </h4>
                                </div>
                                <p className="text-xs text-blue-800/80 dark:text-blue-300/80">
                                    Link streaming hanya akan dapat dilihat oleh vendor dan peserta yang telah berhasil mendaftar/membeli tiket.
                                </p>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="online_platform">Platform Streaming</Label>
                                        <Input
                                            id="online_platform"
                                            value={data.online_platform}
                                            onChange={(e) => setData('online_platform', e.target.value)}
                                            placeholder="Contoh: Zoom Webinar, Google Meet, YouTube Private"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="streaming_link">Link Streaming / Meeting URL *</Label>
                                        <Input
                                            id="streaming_link"
                                            value={data.streaming_link}
                                            onChange={(e) => setData('streaming_link', e.target.value)}
                                            placeholder="https://zoom.us/j/..."
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="streaming_instructions">Petunjuk Akses / Passcode / Aturan Daring</Label>
                                    <Textarea
                                        id="streaming_instructions"
                                        rows={2}
                                        value={data.streaming_instructions}
                                        onChange={(e) => setData('streaming_instructions', e.target.value)}
                                        placeholder="Contoh: Passcode Zoom: 123456. Harap masuk dengan format nama: [Nama Lengkap]."
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Offline Venue Section */}
                        {(isOffline || isHybrid) && (
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-neutral-800 dark:text-neutral-200" />
                                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                        Informasi Venue Fisik & Integrasi Google Maps
                                    </h4>
                                </div>

                                <div>
                                    <Label htmlFor="venue_name">Nama Tempat / Gedung / Ballroom *</Label>
                                    <Input
                                        id="venue_name"
                                        value={data.venue_name}
                                        onChange={(e) => setData('venue_name', e.target.value)}
                                        placeholder="Contoh: Gelora Bung Karno / Ballroom Hotel Pullman"
                                        className="mt-1.5"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="city">Kota / Kabupaten</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Contoh: Jakarta Pusat"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="province">Provinsi</Label>
                                        <Input
                                            id="province"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            placeholder="Contoh: DKI Jakarta"
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="address">Alamat Lengkap</Label>
                                    <Textarea
                                        id="address"
                                        rows={2}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Jl. Jend. Sudirman No. 1..."
                                        className="mt-1.5"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="google_maps_url">Link Google Maps (Share Link / Peta)</Label>
                                    <Input
                                        id="google_maps_url"
                                        value={data.google_maps_url}
                                        onChange={(e) => setData('google_maps_url', e.target.value)}
                                        placeholder="https://maps.google.com/?q=..."
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                                &larr; Sebelumnya
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('schedule')}>
                                Lanjut ke Waktu & Tanggal &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 3: WAKTU & JADWAL */}
            {activeTab === 'schedule' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Waktu & Jadwal Pelaksanaan</CardTitle>
                        <CardDescription>Tentukan tanggal dan rentang jam mulai hingga selesai acara.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <Label htmlFor="start_date_time">Waktu & Tanggal Mulai *</Label>
                                <Input
                                    id="start_date_time"
                                    type="datetime-local"
                                    value={data.start_date_time}
                                    onChange={(e) => setData('start_date_time', e.target.value)}
                                    className="mt-1.5"
                                    required
                                />
                                {errors.start_date_time && (
                                    <p className="mt-1 text-xs text-red-500">{errors.start_date_time}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="end_date_time">Waktu & Tanggal Selesai *</Label>
                                <Input
                                    id="end_date_time"
                                    type="datetime-local"
                                    value={data.end_date_time}
                                    onChange={(e) => setData('end_date_time', e.target.value)}
                                    className="mt-1.5"
                                    required
                                />
                                {errors.end_date_time && (
                                    <p className="mt-1 text-xs text-red-500">{errors.end_date_time}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="timezone">Zona Waktu</Label>
                            <select
                                id="timezone"
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                                className="mt-1.5 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300"
                            >
                                <option value="Asia/Jakarta">WIB (Waktu Indonesia Barat, UTC+7)</option>
                                <option value="Asia/Makassar">WITA (Waktu Indonesia Tengah, UTC+8)</option>
                                <option value="Asia/Jayapura">WIT (Waktu Indonesia Timur, UTC+9)</option>
                            </select>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('format')}>
                                &larr; Sebelumnya
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('tickets')}>
                                Lanjut ke Konfigurasi Tiket &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 4: KONFIGURASI TIKET */}
            {activeTab === 'tickets' && (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle>Konfigurasi Tiket & Kuota Penjualan</CardTitle>
                            <CardDescription>
                                Atur tiket gratis / berbayar, preset tier (Early Bird, Regular, VIP, Group Package), batas kuota, dan periode penjualan.
                            </CardDescription>
                        </div>
                        <Button type="button" onClick={addTicket} size="sm" className="gap-2">
                            <Plus className="size-4" />
                            Tambah Tier Tiket
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.tickets.map((ticket, index) => (
                            <div
                                key={index}
                                className="relative rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-950 space-y-4"
                            >
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            #{index + 1}
                                        </Badge>
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {ticket.name || 'Tiket Baru'}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTicket(index)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <Label>Nama Tiket *</Label>
                                        <Input
                                            value={ticket.name}
                                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                                            placeholder="Contoh: Early Bird / VIP Access"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Tipe Tiket</Label>
                                        <select
                                            value={ticket.type}
                                            onChange={(e) => updateTicket(index, 'type', e.target.value as 'free' | 'paid')}
                                            className="mt-1 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950"
                                        >
                                            <option value="paid">Berbayar</option>
                                            <option value="free">Gratis (Free Admission)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label>Preset Kategori Tier</Label>
                                        <select
                                            value={ticket.tier}
                                            onChange={(e) => updateTicket(index, 'tier', e.target.value as TicketTier)}
                                            className="mt-1 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950"
                                        >
                                            <option value="early_bird">Early Bird</option>
                                            <option value="regular">Regular</option>
                                            <option value="vip">VIP</option>
                                            <option value="group_package">Paket Group (Rombongan)</option>
                                            <option value="custom">Kustom</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <Label>Harga (Rp) {ticket.type === 'free' && '(Gratis)'}</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            disabled={ticket.type === 'free'}
                                            value={ticket.type === 'free' ? 0 : ticket.price}
                                            onChange={(e) => updateTicket(index, 'price', Number(e.target.value))}
                                            placeholder="150000"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label>Kuota Tiket (Jumlah Kursi) *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={ticket.quantity}
                                            onChange={(e) => updateTicket(index, 'quantity', Number(e.target.value))}
                                            placeholder="100"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs">Min Beli</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={ticket.min_per_transaction ?? 1}
                                                onChange={(e) =>
                                                    updateTicket(index, 'min_per_transaction', Number(e.target.value))
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Max Beli</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={ticket.max_per_transaction ?? 5}
                                                onChange={(e) =>
                                                    updateTicket(index, 'max_per_transaction', Number(e.target.value))
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-xs">Periode Mulai Penjualan</Label>
                                        <Input
                                            type="datetime-local"
                                            value={ticket.sale_start_date ?? ''}
                                            onChange={(e) => updateTicket(index, 'sale_start_date', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Periode Akhir Penjualan</Label>
                                        <Input
                                            type="datetime-local"
                                            value={ticket.sale_end_date ?? ''}
                                            onChange={(e) => updateTicket(index, 'sale_end_date', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs">Deskripsi Fasilitas & Benefit Tiket</Label>
                                    <Input
                                        value={ticket.description ?? ''}
                                        onChange={(e) => updateTicket(index, 'description', e.target.value)}
                                        placeholder="Contoh: Termasuk Goodie Bag, Lunch Buffet, Sertifikat Digital..."
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('schedule')}>
                                &larr; Sebelumnya
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('agenda')}>
                                Lanjut ke Rundown &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 5: AGENDA / RUNDOWN INTERAKTIF */}
            {activeTab === 'agenda' && (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle>Agenda & Rundown Interaktif Acara</CardTitle>
                            <CardDescription>
                                Susun urutan jam, judul sesi, pembicara, dan ruangan/panggung untuk memandu peserta.
                            </CardDescription>
                        </div>
                        <Button type="button" onClick={addAgenda} size="sm" className="gap-2">
                            <Plus className="size-4" />
                            Tambah Sesi Rundown
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.agendas.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                                Belum ada sesi rundown. Klik tombol Tambah Sesi Rundown di atas.
                            </div>
                        ) : (
                            data.agendas.map((agenda, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-xs">
                                            Sesi #{index + 1}
                                        </Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAgenda(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                        <div className="sm:col-span-2">
                                            <Label className="text-xs">Judul Sesi Rundown *</Label>
                                            <Input
                                                value={agenda.title}
                                                onChange={(e) => updateAgenda(index, 'title', e.target.value)}
                                                placeholder="Contoh: Keynote Speech / Workshop Sesi 1"
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Jam Mulai</Label>
                                            <Input
                                                type="time"
                                                value={agenda.start_time}
                                                onChange={(e) => updateAgenda(index, 'start_time', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Jam Selesai</Label>
                                            <Input
                                                type="time"
                                                value={agenda.end_time}
                                                onChange={(e) => updateAgenda(index, 'end_time', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-xs">Pembicara / Pemateri</Label>
                                            <Input
                                                value={agenda.speaker_name ?? ''}
                                                onChange={(e) => updateAgenda(index, 'speaker_name', e.target.value)}
                                                placeholder="Nama pembicara yang mengisi sesi ini"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Ruangan / Stage</Label>
                                            <Input
                                                value={agenda.stage_or_room ?? ''}
                                                onChange={(e) => updateAgenda(index, 'stage_or_room', e.target.value)}
                                                placeholder="Contoh: Main Stage / Breakout Room A"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('tickets')}>
                                &larr; Sebelumnya
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('speakers')}>
                                Lanjut ke Pembicara &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 6: PEMBICARA (SPEAKERS) */}
            {activeTab === 'speakers' && (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle>Daftar Pembicara (Speakers)</CardTitle>
                            <CardDescription>
                                Tampilkan tokoh terkemuka, keynote speakers, dan instruktur yang akan tampil di event Anda.
                            </CardDescription>
                        </div>
                        <Button type="button" onClick={addSpeaker} size="sm" className="gap-2">
                            <Plus className="size-4" />
                            Tambah Pembicara
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.speakers.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                                Belum ada pembicara yang didaftarkan. Klik tombol Tambah Pembicara di atas jika event memiliki narasumber.
                            </div>
                        ) : (
                            data.speakers.map((speaker, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs">
                                            Pembicara #{index + 1}
                                        </Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSpeaker(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div>
                                            <Label className="text-xs">Nama Lengkap *</Label>
                                            <Input
                                                value={speaker.name}
                                                onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                                                placeholder="Contoh: Budi Santoso, Ph.D."
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Jabatan / Role</Label>
                                            <Input
                                                value={speaker.role_or_title ?? ''}
                                                onChange={(e) => updateSpeaker(index, 'role_or_title', e.target.value)}
                                                placeholder="Contoh: Chief Executive Officer"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Perusahaan / Institusi</Label>
                                            <Input
                                                value={speaker.organization ?? ''}
                                                onChange={(e) => updateSpeaker(index, 'organization', e.target.value)}
                                                placeholder="Contoh: Google Asia Pasifik"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-xs">Foto Profil / Avatar</Label>
                                            <div className="mt-1.5 flex items-center gap-3">
                                                {speaker.avatar ? (
                                                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                                                        <img
                                                            src={
                                                                speaker.avatar instanceof File
                                                                    ? URL.createObjectURL(speaker.avatar)
                                                                    : speaker.avatar
                                                            }
                                                            alt={speaker.name || 'Avatar'}
                                                            className="size-full object-cover"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 text-neutral-400">
                                                        <UploadCloud className="size-6" />
                                                    </div>
                                                )}
                                                <div className="flex-1 space-y-1">
                                                    <input
                                                        type="file"
                                                        id={`speaker-avatar-${index}`}
                                                        accept="image/jpeg,image/png,image/webp"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            if (file.size > MAX_FILE_SIZE) {
                                                                toast.error('Ukuran foto terlalu besar. Maksimal 10MB.');
                                                                alert('Ukuran foto terlalu besar. Maksimal 10MB.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                                                            if (!validTypes.includes(file.type)) {
                                                                toast.error('Format file tidak didukung. Harap upload format JPG, PNG, atau WEBP.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            updateSpeaker(index, 'avatar', file);
                                                        }}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs gap-1.5"
                                                            onClick={() => {
                                                                document.getElementById(`speaker-avatar-${index}`)?.click();
                                                            }}
                                                        >
                                                            <UploadCloud className="size-3.5" />
                                                            {speaker.avatar ? 'Ganti Foto' : 'Pilih Foto'}
                                                        </Button>
                                                        {speaker.avatar && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 text-xs text-red-500 hover:text-red-700"
                                                                onClick={() => {
                                                                    updateSpeaker(index, 'avatar', null);
                                                                    const input = document.getElementById(`speaker-avatar-${index}`) as HTMLInputElement;
                                                                    if (input) input.value = '';
                                                                }}
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                Hapus
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                        Maksimal 10MB (JPG/PNG/WEBP)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Bio Singkat</Label>
                                            <Input
                                                value={speaker.bio ?? ''}
                                                onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                                                placeholder="10+ tahun pengalaman di bidang teknologi..."
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('agenda')}>
                                &larr; Sebelumnya
                            </Button>
                            <Button type="button" onClick={() => setActiveTab('sponsors')}>
                                Lanjut ke Sponsor &rarr;
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* TAB 7: SPONSOR & PARTNER */}
            {activeTab === 'sponsors' && (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle>Sponsor & Mitra Acara</CardTitle>
                            <CardDescription>
                                Cantumkan logo dan tier partner (Platinum, Gold, Silver, Media Partner).
                            </CardDescription>
                        </div>
                        <Button type="button" onClick={addSponsor} size="sm" className="gap-2">
                            <Plus className="size-4" />
                            Tambah Sponsor
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.sponsors.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
                                Belum ada sponsor. Klik tombol Tambah Sponsor di atas jika acara didukung mitra.
                            </div>
                        ) : (
                            data.sponsors.map((sponsor, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-xs uppercase">
                                            {sponsor.tier}
                                        </Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSponsor(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div>
                                            <Label className="text-xs">Nama Perusahaan Sponsor *</Label>
                                            <Input
                                                value={sponsor.name}
                                                onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                                                placeholder="Contoh: PT Telekomunikasi Indonesia"
                                                className="mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Kategori Tier</Label>
                                            <select
                                                value={sponsor.tier}
                                                onChange={(e) => updateSponsor(index, 'tier', e.target.value as SponsorTier)}
                                                className="mt-1 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950"
                                            >
                                                <option value="platinum">Platinum Sponsor</option>
                                                <option value="gold">Gold Sponsor</option>
                                                <option value="silver">Silver Sponsor</option>
                                                <option value="bronze">Bronze Sponsor</option>
                                                <option value="media_partner">Media Partner</option>
                                                <option value="community_partner">Community Partner</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Website URL</Label>
                                            <Input
                                                value={sponsor.website_url ?? ''}
                                                onChange={(e) => updateSponsor(index, 'website_url', e.target.value)}
                                                placeholder="https://company.com"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs">Logo Sponsor</Label>
                                        <div className="mt-1.5 flex items-center gap-3">
                                            {sponsor.logo ? (
                                                <div className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
                                                    <img
                                                        src={
                                                            sponsor.logo instanceof File
                                                                ? URL.createObjectURL(sponsor.logo)
                                                                : sponsor.logo
                                                        }
                                                        alt={sponsor.name || 'Logo'}
                                                        className="max-h-full max-w-full object-contain"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 text-neutral-400">
                                                    <UploadCloud className="size-6" />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <input
                                                    type="file"
                                                    id={`sponsor-logo-${index}`}
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        if (file.size > MAX_FILE_SIZE) {
                                                            toast.error('Ukuran foto terlalu besar. Maksimal 10MB.');
                                                            alert('Ukuran foto terlalu besar. Maksimal 10MB.');
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                                                        if (!validTypes.includes(file.type)) {
                                                            toast.error('Format file tidak didukung. Harap upload format JPG, PNG, atau WEBP.');
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        updateSponsor(index, 'logo', file);
                                                    }}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs gap-1.5"
                                                        onClick={() => {
                                                            document.getElementById(`sponsor-logo-${index}`)?.click();
                                                        }}
                                                    >
                                                        <UploadCloud className="size-3.5" />
                                                        {sponsor.logo ? 'Ganti Logo' : 'Pilih Logo'}
                                                    </Button>
                                                    {sponsor.logo && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 text-xs text-red-500 hover:text-red-700"
                                                            onClick={() => {
                                                                updateSponsor(index, 'logo', null);
                                                                const input = document.getElementById(`sponsor-logo-${index}`) as HTMLInputElement;
                                                                if (input) input.value = '';
                                                            }}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    Maksimal 10MB (JPG/PNG/WEBP)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={() => setActiveTab('speakers')}>
                                &larr; Sebelumnya
                            </Button>
                            <div className="flex items-center gap-3">
                                <Button asChild variant="ghost">
                                    <Link href="/vendor/events">Batal</Link>
                                </Button>
                                <Button type="submit" disabled={processing} size="lg" className="gap-2 shadow-sm">
                                    <CheckCircle2 className="size-4" />
                                    {processing ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan Event' : 'Terbitkan / Simpan Event'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bottom floating save bar for quick submission on any tab */}
            <div className="sticky bottom-4 flex items-center justify-between rounded-xl border border-neutral-200/90 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90">
                <div className="text-xs text-neutral-500">
                    Status: <span className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase">{data.status}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/vendor/events">Kembali ke Daftar</Link>
                    </Button>
                    <Button type="submit" disabled={processing} className="gap-2 shadow-xs">
                        <CheckCircle2 className="size-4" />
                        {processing ? 'Menyimpan...' : isEditing ? 'Update Event' : 'Simpan Event'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
