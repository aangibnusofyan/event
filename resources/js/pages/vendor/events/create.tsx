import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/vendor/event-form';
import type { Category } from '@/types/event';

interface Props {
    categories: Category[];
}

export default function VendorEventCreate({ categories }: Props) {
    return (
        <>
            <Head title="Buat Event Baru" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon" className="size-9 rounded-full">
                        <Link href="/vendor/events">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Buat Event Baru
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Lengkapi informasi event, tentukan format, kuota tiket, dan susun rundown.
                        </p>
                    </div>
                </div>

                <EventForm categories={categories} />
            </div>
        </>
    );
}
