import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Check,
    Copy,
    Edit3,
    Plus,
    Tag,
    TicketPercent,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Calendar,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EventCoupon } from '@/types/event';

interface PaginatedCoupons {
    data: EventCoupon[];
    current_page: number;
    last_page: number;
    total: number;
    next_page_url?: string | null;
    prev_page_url?: string | null;
}

interface EventOption {
    id: number;
    title: string;
}

interface Props {
    coupons: PaginatedCoupons;
    events: EventOption[];
    stats: {
        totalCoupons: number;
        activeCoupons: number;
        totalUsed: number;
    };
}

export default function VendorCouponsIndex({ coupons, events, stats }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<EventCoupon | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const form = useForm({
        code: '',
        event_id: '' as string | number,
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_amount: 10,
        max_discount_amount: 50000 as number | '',
        min_purchase_amount: 0,
        usage_limit: 100 as number | '',
        usage_limit_per_user: 1,
        valid_from: '',
        valid_until: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingCoupon(null);
        form.reset();
        form.setData({
            code: '',
            event_id: '',
            discount_type: 'percentage',
            discount_amount: 20,
            max_discount_amount: 50000,
            min_purchase_amount: 100000,
            usage_limit: 100,
            usage_limit_per_user: 1,
            valid_from: '',
            valid_until: '',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (coupon: EventCoupon) => {
        setEditingCoupon(coupon);
        form.setData({
            code: coupon.code,
            event_id: coupon.event_id ?? '',
            discount_type: coupon.discount_type,
            discount_amount: Number(coupon.discount_amount),
            max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : '',
            min_purchase_amount: Number(coupon.min_purchase_amount),
            usage_limit: coupon.usage_limit ? Number(coupon.usage_limit) : '',
            usage_limit_per_user: coupon.usage_limit_per_user ?? 1,
            valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
            valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
            is_active: coupon.is_active,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form.data,
            code: form.data.code.toUpperCase(),
            event_id: form.data.event_id === '' ? null : Number(form.data.event_id),
            max_discount_amount: form.data.max_discount_amount === '' ? null : Number(form.data.max_discount_amount),
            usage_limit: form.data.usage_limit === '' ? null : Number(form.data.usage_limit),
            valid_from: form.data.valid_from || null,
            valid_until: form.data.valid_until || null,
        };

        if (editingCoupon) {
            router.put(`/vendor/coupons/${editingCoupon.id}`, payload, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post('/vendor/coupons', payload, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleToggle = (coupon: EventCoupon) => {
        router.patch(`/vendor/coupons/${coupon.id}/toggle`);
    };

    const handleDelete = (coupon: EventCoupon) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kupon ${coupon.code}?`)) {
            router.delete(`/vendor/coupons/${coupon.id}`);
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <>
            <Head title="Kupon Promo & Diskon" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl">
                            Kupon Promo & Diskon
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Buat kode promo persentase atau potongan harga untuk meningkatkan konversi penjualan tiket Anda.
                        </p>
                    </div>
                    <Button onClick={openCreateModal} size="lg" className="gap-2 shadow-sm">
                        <Plus className="size-4" />
                        Buat Kupon Baru
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60">
                        <CardContent className="p-5">
                            <span className="text-xs font-medium text-neutral-500">Total Kupon Dibuat</span>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalCoupons}</span>
                                <span className="text-xs text-neutral-500">kupon</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60">
                        <CardContent className="p-5">
                            <span className="text-xs font-medium text-neutral-500">Kupon Aktif</span>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activeCoupons}</span>
                                <span className="text-xs text-neutral-500">dapat digunakan</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200/80 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60">
                        <CardContent className="p-5">
                            <span className="text-xs font-medium text-neutral-500">Total Kupon Terpakai</span>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsed}</span>
                                <span className="text-xs text-neutral-500">kali klaim</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coupons Table / Cards */}
                {coupons.data.length === 0 ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800">
                        <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-900">
                            <TicketPercent className="size-8 text-neutral-400" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            Belum ada kupon promo
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                            Buat kode promo kustom pertama Anda dengan diskon persentase atau potongan harga tetap.
                        </p>
                        <Button onClick={openCreateModal} className="mt-5 gap-2">
                            <Plus className="size-4" />
                            Buat Kupon Baru
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-6 py-4">Kode Kupon</th>
                                        <th className="px-6 py-4">Tipe & Nilai Diskon</th>
                                        <th className="px-6 py-4">Event Yang Berlaku</th>
                                        <th className="px-6 py-4">Penggunaan</th>
                                        <th className="px-6 py-4">Masa Berlaku</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {coupons.data.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-2">
                                                    <span>{coupon.code}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(coupon.code)}
                                                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                                                    >
                                                        {copiedCode === coupon.code ? (
                                                            <Check className="size-3.5 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="size-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {coupon.discount_type === 'percentage'
                                                        ? `${coupon.discount_amount}%`
                                                        : `Rp ${new Intl.NumberFormat('id-ID').format(coupon.discount_amount)}`}
                                                </div>
                                                {coupon.max_discount_amount && (
                                                    <span className="text-[11px] text-neutral-500">
                                                        Maks Rp {new Intl.NumberFormat('id-ID').format(coupon.max_discount_amount)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {coupon.event ? (
                                                    <span className="text-xs text-blue-600 dark:text-blue-400 line-clamp-1">
                                                        {coupon.event.title}
                                                    </span>
                                                ) : (
                                                    <Badge variant="outline" className="text-[11px]">
                                                        Semua Event
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs">
                                                    <span className="font-semibold">{coupon.used_count}</span>
                                                    <span className="text-neutral-500">
                                                        {' '}
                                                        / {coupon.usage_limit ? `${coupon.usage_limit} kuota` : 'Tanpa batas'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-neutral-500">
                                                {coupon.valid_until ? (
                                                    <span>
                                                        s/d{' '}
                                                        {new Date(coupon.valid_until).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                ) : (
                                                    'Berlaku selamanya'
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(coupon)}
                                                    className="flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    {coupon.is_active ? (
                                                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px]">
                                                            Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[11px]">
                                                            Nonaktif
                                                        </Badge>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(coupon)}
                                                        className="size-8 p-0"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(coupon)}
                                                        className="size-8 p-0 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Create & Edit Modal Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingCoupon ? 'Edit Kupon Promo' : 'Buat Kupon Promo Baru'}</DialogTitle>
                            <DialogDescription>
                                Masukkan kode kupon, tentukan diskon persen atau nominal, batas penggunaan, dan masa berlaku.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="code">Kode Kupon (Huruf Kapital) *</Label>
                                <Input
                                    id="code"
                                    value={form.data.code}
                                    onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                    placeholder="Contoh: MERDEKA50 / DISKON100K"
                                    className="font-mono mt-1 uppercase"
                                    required
                                />
                                {form.errors.code && <p className="mt-1 text-xs text-red-500">{form.errors.code}</p>}
                            </div>

                            <div>
                                <Label htmlFor="event_id">Berlaku Untuk Event</Label>
                                <select
                                    id="event_id"
                                    value={form.data.event_id}
                                    onChange={(e) => form.setData('event_id', e.target.value)}
                                    className="mt-1 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950"
                                >
                                    <option value="">Semua Event Milik Saya</option>
                                    {events.map((ev) => (
                                        <option key={ev.id} value={ev.id}>
                                            {ev.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tipe Diskon</Label>
                                    <select
                                        value={form.data.discount_type}
                                        onChange={(e) =>
                                            form.setData('discount_type', e.target.value as 'percentage' | 'fixed')
                                        }
                                        className="mt-1 flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:border-neutral-800 dark:bg-neutral-950"
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Potongan Nominal (Rp)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>
                                        Nilai Diskon * {form.data.discount_type === 'percentage' ? '(%)' : '(Rp)'}
                                    </Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={form.data.discount_amount}
                                        onChange={(e) => form.setData('discount_amount', Number(e.target.value))}
                                        placeholder="20"
                                        className="mt-1"
                                        required
                                    />
                                    {form.errors.discount_amount && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.discount_amount}</p>
                                    )}
                                </div>
                            </div>

                            {form.data.discount_type === 'percentage' && (
                                <div>
                                    <Label>Batas Maksimal Potongan Diskon (Rp, opsional)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.data.max_discount_amount}
                                        onChange={(e) =>
                                            form.setData(
                                                'max_discount_amount',
                                                e.target.value === '' ? '' : Number(e.target.value)
                                            )
                                        }
                                        placeholder="Contoh: 50000"
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Minimum Belanja (Rp)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.data.min_purchase_amount}
                                        onChange={(e) => form.setData('min_purchase_amount', Number(e.target.value))}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Batas Total Kuota Penggunaan</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={form.data.usage_limit}
                                        onChange={(e) =>
                                            form.setData('usage_limit', e.target.value === '' ? '' : Number(e.target.value))
                                        }
                                        placeholder="Kosongkan jika tanpa batas"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Mulai Berlaku (Opsional)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.data.valid_from}
                                        onChange={(e) => form.setData('valid_from', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Berakhir Pada (Opsional)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.data.valid_until}
                                        onChange={(e) => form.setData('valid_until', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Menyimpan...' : editingCoupon ? 'Simpan Perubahan' : 'Buat Kupon'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
