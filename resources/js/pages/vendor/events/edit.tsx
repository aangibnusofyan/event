import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventForm } from '@/components/vendor/event-form';
import type { Category, EventItem } from '@/types/event';

interface Props {
    event: EventItem;
    categories: Category[];
}

export default function VendorEventEdit({ event, categories }: Props) {
    return (
        <>
            <Head title={`Edit Event: ${event.title}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="icon" className="size-9 rounded-full">
                            <Link href="/vendor/events">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Edit Event
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Perbarui konfigurasi tiket, rundown, pembicara, atau detail event.
                            </p>
                        </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={`/vendor/events/${event.id}`}>
                            <Eye className="size-4" />
                            Lihat Preview Internal
                        </Link>
                    </Button>
                </div>

                <EventForm categories={categories} event={event} isEditing />
            </div>
        </>
    );
}
