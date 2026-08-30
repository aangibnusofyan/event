import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { register } from '@/routes';
import { ArrowRight, Check } from 'lucide-react';

interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted: boolean;
}

const plans: Plan[] = [
    {
        name: 'Starter',
        price: 'Gratis',
        period: '',
        description: 'Sempurna untuk event kecil dan personal.',
        features: [
            '1 Event per bulan',
            'Maksimal 100 peserta',
            'Tiket Basic',
            'QR Code Check-in',
            'Email Support',
        ],
        cta: 'Mulai Gratis',
        highlighted: false,
    },
    {
        name: 'Professional',
        price: 'Rp 299K',
        period: '/bulan',
        description: 'Untuk event organizer profesional.',
        features: [
            'Event Unlimited',
            'Peserta Unlimited',
            'Tiket Multi-tier',
            'Broadcast WA & Email',
            'Dashboard Analitik',
            'E-Sertifikat',
            'Priority Support',
        ],
        cta: 'Mulai 14 Hari Trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'Solusi lengkap untuk organisasi besar.',
        features: [
            'Semua fitur Professional',
            'White-label Branding',
            'API Access',
            'Dedicated Account Manager',
            'Custom Integration',
            'SLA Guarantee',
        ],
        cta: 'Hubungi Sales',
        highlighted: false,
    },
];

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
    const { ref, isVisible } = useScrollAnimation(0.1);

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-all duration-700 hover:shadow-lg',
                plan.highlighted
                    ? 'bg-card scale-[1.02] border-[#C1502E] shadow-xl lg:scale-105'
                    : 'border-border/50 bg-card',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0',
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {plan.highlighted && (
                <div className="absolute top-0 right-0 left-0">
                    <div className="mx-auto w-fit -translate-y-px rounded-b-lg bg-[#C1502E] px-4 py-1">
                        <span className="text-xs font-semibold text-white">
                            Paling Populer
                        </span>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-foreground font-serif text-xl font-bold">
                    {plan.name}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                    {plan.description}
                </p>
            </div>

            <div className="mb-8">
                <span className="text-foreground font-serif text-4xl font-bold">
                    {plan.price}
                </span>
                {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                )}
            </div>

            <ul className="mb-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
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
                className={cn(
                    'w-full',
                    plan.highlighted &&
                        'bg-[#C1502E] text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90',
                )}
                variant={plan.highlighted ? 'default' : 'outline'}
            >
                <Link href={register()}>
                    {plan.cta}
                    <ArrowRight data-icon="inline-end" />
                </Link>
            </Button>
        </div>
    );
}

export function PricingSection() {
    const { ref, isVisible } = useScrollAnimation();

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
                        Pilih Paket yang Tepat
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Harga transparan tanpa biaya tersembunyi. Mulai gratis,
                        upgrade kapan saja.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, idx) => (
                        <PricingCard key={plan.name} plan={plan} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
