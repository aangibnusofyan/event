import { Head, Link } from '@inertiajs/react';
import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { ArrowRight, BarChart3, Search, Ticket, UserPlus } from 'lucide-react';
import { register } from '@/routes';
import type { LucideIcon } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Platform Event & Ticketing Terpercaya">
                <meta
                    name="description"
                    content="SpotEvent.id — Platform event dan ticketing terpercaya di Indonesia. Kelola event, jual tiket, dan tingkatkan engagement peserta dalam satu platform yang aman."
                />
                <meta
                    property="og:title"
                    content="SpotEvent.id — Platform Event & Ticketing Terpercaya"
                />
                <meta
                    property="og:description"
                    content="Kelola event, jual tiket, dan tingkatkan engagement peserta dalam satu platform yang aman dan mudah digunakan."
                />
                <meta property="og:type" content="website" />
            </Head>

            <Navbar />

            <main>
                <HeroSection />
                <TrustedBySection />
                <FeaturesSection />
                <HowItWorksSection />
                <PricingSection />
                <TestimonialsSection />
                <CTASection />
            </main>

            <Footer />
        </>
    );
}

/* ─────────────────────────────────────────────
 * Trusted By Section
 * ───────────────────────────────────────────── */

const partners = [
    'TechCorp',
    'MediaGroup',
    'EventPro',
    'StartupHub',
    'CreativeStudio',
];

function TrustedBySection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="bg-background py-16">
            <div
                ref={ref}
                className={cn(
                    'mx-auto max-w-7xl px-6 text-center transition-all duration-700 lg:px-8',
                    isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0',
                )}
            >
                <p className="text-muted-foreground mb-8 text-sm font-medium tracking-wider uppercase">
                    Dipercaya oleh 1,000+ Event Organizer di Indonesia
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                    {partners.map((name) => (
                        <div
                            key={name}
                            className="bg-muted/50 text-muted-foreground/50 hover:text-muted-foreground flex h-10 items-center rounded-lg px-6 text-sm font-semibold transition-colors"
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * How It Works Section
 * ───────────────────────────────────────────── */

interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        icon: UserPlus,
        title: 'Daftar Akun',
        description:
            'Buat akun gratis dalam hitungan detik. Cukup email dan password.',
    },
    {
        icon: Search,
        title: 'Buat atau Temukan Event',
        description:
            'Vendor buat event, peserta temukan event impian dengan filter lengkap.',
    },
    {
        icon: Ticket,
        title: 'Kelola & Nikmati',
        description:
            'Kelola tiket dan check-in untuk vendor, atau nikmati event untuk peserta.',
    },
    {
        icon: BarChart3,
        title: 'Laporan & Review',
        description:
            'Dapatkan analitik lengkap dan berikan ulasan untuk meningkatkan kualitas.',
    },
];

function StepCard({ step, index }: { step: Step; index: number }) {
    const { ref, isVisible } = useScrollAnimation(0.1);
    const Icon = step.icon;

    return (
        <div
            ref={ref}
            className={cn(
                'relative text-center transition-all duration-700',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0',
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="relative z-10 mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#1B3A5C] text-white shadow-lg">
                <Icon className="size-6" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-[#C1502E] text-[10px] font-bold text-white">
                    {index + 1}
                </span>
            </div>
            <h3 className="text-foreground mb-2 font-serif text-lg font-bold">
                {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
            </p>
        </div>
    );
}

function HowItWorksSection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="cara-kerja" className="bg-background py-20 lg:py-32">
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
                        Cara Kerja
                    </span>
                    <h2 className="text-foreground font-serif text-3xl font-bold tracking-tight lg:text-4xl">
                        Mulai dalam 4 Langkah Mudah
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Dari pendaftaran hingga laporan, semua bisa dilakukan
                        dengan mudah dan cepat.
                    </p>
                </div>

                {/* Steps grid with connector line */}
                <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Connector line (desktop only) */}
                    <div className="border-border pointer-events-none absolute top-7 right-[12%] left-[12%] hidden border-t-2 border-dashed lg:block" />

                    {steps.map((step, idx) => (
                        <StepCard key={step.title} step={step} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
 * CTA Section
 * ───────────────────────────────────────────── */

function CTASection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035] py-20 lg:py-32">
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
                <h2 className="mb-6 font-serif text-3xl font-bold text-white lg:text-5xl">
                    Siap Membuat Event Luar Biasa?
                </h2>
                <p className="mb-10 text-lg text-white/60">
                    Bergabung dengan ribuan event organizer yang sudah
                    mempercayai SpotEvent.id. Mulai gratis hari ini.
                </p>
                <Button
                    asChild
                    size="lg"
                    className="bg-[#C1502E] px-10 text-base text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90"
                >
                    <Link href={register()}>
                        Mulai Gratis Sekarang
                        <ArrowRight data-icon="inline-end" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
