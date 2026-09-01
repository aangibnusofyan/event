import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Harga', href: '#harga' },
];

export function Navbar({ hideNavItems = false }: { hideNavItems?: boolean } = {}) {
    const { auth } = usePage<{
        auth: { user: { name: string } | null };
    }>().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                scrolled
                    ? 'border-border/50 border-b bg-white/90 shadow-sm backdrop-blur-xl dark:bg-[#1A1A19]/90'
                    : 'bg-transparent',
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#1B3A5C]">
                        <span className="text-sm font-bold text-white">SE</span>
                    </div>
                    <span
                        className={cn(
                            'font-serif text-xl font-bold transition-colors',
                            scrolled ? 'text-foreground' : 'text-white',
                        )}
                    >
                        SpotEvent
                        <span className="text-[#C1502E]">.id</span>
                    </span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 lg:flex">
                    {!hideNavItems && navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-[#C1502E]',
                                scrolled
                                    ? 'text-foreground/70'
                                    : 'text-white/80',
                            )}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTAs */}
                <div className="hidden items-center gap-3 lg:flex">
                    {auth.user ? (
                        <Button asChild>
                            <Link href={dashboard().url}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant={scrolled ? 'ghost' : 'outline'}
                                className={cn(
                                    !scrolled &&
                                        'border-white/30 text-white hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Link href={login().url}>Masuk</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-[#C1502E] text-white hover:bg-[#C1502E]/90"
                            >
                                <Link href={register().url}>Daftar Sekarang</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                !scrolled && 'text-white hover:bg-white/10',
                            )}
                        >
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                        <SheetTitle className="sr-only">
                            Menu Navigasi
                        </SheetTitle>
                        <div className="flex flex-col gap-6 pt-8">
                            {!hideNavItems && navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-foreground/70 hover:text-foreground text-lg font-medium transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="mt-4 flex flex-col gap-3">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={dashboard().url}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="outline">
                                            <Link href={login().url}>Masuk</Link>
                                        </Button>
                                        <Button
                                            asChild
                                            className="bg-[#C1502E] text-white hover:bg-[#C1502E]/90"
                                        >
                                            <Link href={register().url}>
                                                Daftar Sekarang
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    );
}
