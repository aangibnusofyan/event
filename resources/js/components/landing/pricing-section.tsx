import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { register } from '@/routes';
import { ArrowRight, Check } from 'lucide-react';

const features: string[] = [
    'Event Unlimited',
    'Peserta Unlimited',
    'Tiket Multi-tier',
    'QR Code Check-in',
    'Broadcast WA & Email',
    'Dashboard Analitik',
    'E-Sertifikat',
    'Priority Support',
];

export function PricingSection() {
    const { ref, isVisible } = useScrollAnimation();
    const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation(0.1);

    return (
        <section id="harga" className="bg-background py-20 lg:py-32">
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
                        Harga
                    </span>
                    <h2 className="text-foreground font-serif text-3xl font-bold tracking-tight lg:text-4xl">
                        Gratis untuk Semua
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Gunakan semua fitur. Gratis
                        selamanya tanpa biaya langganan.                 </p>
                </div>

                {/* Single pricing card */}
                <div
                    ref={cardRef}
                    className={cn(
                        'relative mx-auto flex max-w-lg flex-col overflow-hidden rounded-2xl border border-[#C1502E] p-8 shadow-xl transition-all duration-700 hover:shadow-2xl',
                        'bg-card',
                        cardVisible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-12 opacity-0',
                    )}
                >
                    {/* Badge */}
                    <div className="absolute top-0 right-0 left-0">
                        <div className="mx-auto w-fit -translate-y-px rounded-b-lg bg-[#C1502E] px-4 py-1">
                            <span className="text-xs font-semibold text-white">
                                Gratis Selamanya
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 text-center">
                        <h3 className="text-foreground font-serif text-xl font-bold">
                            Semua Fitur, Satu Harga Transparan
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Tidak ada biaya langganan bulanan.
                        </p>
                    </div>

                    <div className="mb-2 text-center">
                        <span className="text-foreground font-serif text-5xl font-bold">
                            Rp 0
                        </span>
                    </div>
                    <p className="text-muted-foreground mb-8 text-center text-sm">
                        Biaya admin{' '}
                        <span className="font-semibold text-[#C1502E]">
                            3%
                        </span>{' '}
                        per transaksi tiket berbayar
                    </p>

                    <ul className="mb-8 grid flex-1 gap-3 sm:grid-cols-2">
                        {features.map((feature) => (
                            <li
                                key={feature}
                                className="text-foreground/80 flex items-center gap-3 text-sm"
                            >
                                <Check className="size-4 shrink-0 text-[#C1502E]" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Button
                        asChild
                        className="w-full bg-[#C1502E] text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90"
                    >
                        <Link href={register()}>
                            Mulai Sekarang — Gratis
                            <ArrowRight data-icon="inline-end" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
