import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({
    target,
    suffix = '',
}: {
    target: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const duration = 2000;
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
}

const stats = [
    {
        value: 10000,
        suffix: '+',
        label: 'Events Terselenggara',
    },
    {
        value: 500000,
        suffix: '+',
        label: 'Peserta Terdaftar',
    },
    { value: 100, suffix: '+', label: 'Kota di Indonesia' },
];

export function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#152E4A] to-[#0F2035]">
            {/* Decorative floating elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 size-[500px] rounded-full bg-[#C1502E]/10 blur-[120px]"
                    style={{
                        animation: 'float 8s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute top-1/3 -left-20 size-[350px] rounded-full bg-[#D9C4A3]/8 blur-[100px]"
                    style={{
                        animation: 'float-reverse 10s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute right-1/4 -bottom-20 size-[400px] rounded-full bg-[#1B3A5C]/20 blur-[80px]"
                    style={{
                        animation: 'pulse-soft 6s ease-in-out infinite',
                    }}
                />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-24 pb-20 text-center lg:px-8">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-sm">
                    <Sparkles className="size-4 text-[#D9C4A3]" />
                    <span className="text-sm font-medium text-white/80">
                        Platform Event #1 di Indonesia
                    </span>
                </div>

                {/* Headline */}
                <h1 className="mb-6 max-w-4xl font-serif text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                    Platform Event &{' '}
                    <span className="bg-gradient-to-r from-[#D9C4A3] to-[#C1502E] bg-clip-text text-transparent">
                        Ticketing
                    </span>{' '}
                    Terpercaya
                </h1>

                {/* Subtitle */}
                <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
                    Kelola event, jual tiket, dan tingkatkan engagement peserta
                    dalam satu platform yang aman dan mudah digunakan.
                </p>

                {/* CTAs */}
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="bg-[#C1502E] px-8 text-base text-white shadow-lg shadow-[#C1502E]/25 hover:bg-[#C1502E]/90"
                        asChild
                    >
                        <Link href={register()}>
                            Mulai Gratis Sekarang
                            <ArrowRight data-icon="inline-end" />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        className="bg-[#8C6538] px-8 text-base text-white shadow-md hover:bg-[#785324] border-0 font-medium transition-colors"
                        asChild
                    >
                        <a href="#fitur">Jelajahi Fitur</a>
                    </Button>
                </div>

                {/* Stats */}
                <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="font-serif text-3xl font-bold text-white lg:text-4xl">
                                <AnimatedCounter
                                    target={stat.value}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <div className="mt-1 text-sm text-white/40">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom wave divider */}
            <div className="pointer-events-none absolute -bottom-1 left-0 right-0 overflow-hidden leading-none z-0">
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block w-full h-12 sm:h-16 lg:h-20"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 85H1440V40C1440 40 1320 0 1080 20C840 40 720 60 480 40C240 20 120 0 0 20V85Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
}
