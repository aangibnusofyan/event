import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
    initials: string;
}

const testimonials: Testimonial[] = [
    {
        quote: 'SpotEvent.id benar-benar mengubah cara kami mengelola event. Sistem tiketingnya sangat mudah dan check-in QR code membuat proses registrasi 10x lebih cepat.',
        name: 'Rina Wijaya',
        role: 'Event Director',
        company: 'CreativeHub Indonesia',
        initials: 'RW',
    },
    {
        quote: 'Fitur broadcast WhatsApp dan e-sertifikat otomatis menghemat waktu tim kami hingga 40%. Platform yang luar biasa untuk event organizer.',
        name: 'Ahmad Fauzi',
        role: 'CEO',
        company: 'TechConf Asia',
        initials: 'AF',
    },
    {
        quote: 'Sebagai peserta, pengalaman mendaftar dan mendapatkan e-tiket sangat seamless. Pembayaran multi-channel membuat semuanya lebih mudah.',
        name: 'Sari Dewi',
        role: 'Community Manager',
        company: 'StartupJakarta',
        initials: 'SD',
    },
];

function TestimonialCard({
    testimonial,
    index,
}: {
    testimonial: Testimonial;
    index: number;
}) {
    const { ref, isVisible } = useScrollAnimation(0.1);

    return (
        <div
            ref={ref}
            className={cn(
                'border-border/50 bg-background relative rounded-2xl border p-8 transition-all duration-700 hover:shadow-lg',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0',
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Quote icon */}
            <Quote className="mb-4 size-8 text-[#C1502E]/20" />

            {/* Stars */}
            <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className="size-4 fill-[#D9C4A3] text-[#D9C4A3]"
                    />
                ))}
            </div>

            {/* Quote text */}
            <p className="text-foreground/80 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#1B3A5C] text-sm font-semibold text-white">
                    {testimonial.initials}
                </div>
                <div>
                    <div className="text-foreground text-sm font-semibold">
                        {testimonial.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        {testimonial.role}, {testimonial.company}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TestimonialsSection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section className="bg-card py-20 lg:py-32">
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
                        Testimoni
                    </span>
                    <h2 className="text-foreground font-serif text-3xl font-bold tracking-tight lg:text-4xl">
                        Apa Kata Mereka
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                        Bergabung dengan ribuan organizer dan peserta yang sudah
                        merasakan kemudahan SpotEvent.id.
                    </p>
                </div>

                {/* Testimonial cards */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, idx) => (
                        <TestimonialCard
                            key={testimonial.name}
                            testimonial={testimonial}
                            index={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
