import { Separator } from '@/components/ui/separator';

const footerLinks: Record<string, string[]> = {
    Produk: ['Fitur', 'Harga', 'Integrasi', 'API Documentation'],
    Perusahaan: ['Tentang Kami', 'Blog', 'Karir', 'Kontak'],
    Legal: ['Syarat & Ketentuan', 'Kebijakan Privasi', 'Kebijakan Refund'],
    Dukungan: ['Pusat Bantuan', 'FAQ', 'Hubungi Kami', 'Status'],
};

const socialLinks = [
    { label: 'X', initial: '𝕏' },
    { label: 'Instagram', initial: 'IG' },
    { label: 'LinkedIn', initial: 'in' },
    { label: 'YouTube', initial: 'YT' },
];

export function Footer() {
    return (
        <footer className="bg-[#1A1A19] text-[#F1E9DD]">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#C1502E]">
                                <span className="text-sm font-bold text-white">
                                    SE
                                </span>
                            </div>
                            <span className="font-serif text-xl font-bold">
                                SpotEvent
                                <span className="text-[#C1502E]">.id</span>
                            </span>
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-[#A8A8A7]">
                            Platform event dan ticketing terpercaya di
                            Indonesia. Kelola event Anda dengan mudah, aman, dan
                            profesional.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-xs font-medium text-[#A8A8A7] transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    {social.initial}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#D9C4A3] uppercase">
                                {title}
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-[#A8A8A7] transition-colors hover:text-white"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-10 bg-white/10" />

                <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#6B6B6A] md:flex-row">
                    <p>&copy; 2026 SpotEvent.id. All rights reserved.</p>
                    <p>Made with ❤️ in Indonesia</p>
                </div>
            </div>
        </footer>
    );
}
