import { usePage, Link } from '@inertiajs/react';
import { BookOpen, Calendar, ExternalLink, FolderGit2, LayoutGrid, TicketPercent } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isVendor = auth.user?.role === 'vendor';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(isVendor
            ? [
                  {
                      title: 'Event Saya',
                      href: '/vendor/events',
                      icon: Calendar,
                  },
                  {
                      title: 'Kupon Promo',
                      href: '/vendor/coupons',
                      icon: TicketPercent,
                  },
                  ...(auth.user?.username
                      ? [
                            {
                                title: 'Halaman Profil Publik',
                                href: `/${auth.user.username}`,
                                icon: ExternalLink,
                            },
                        ]
                      : []),
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Dokumentasi',
            href: 'https://laravel.com/docs',
            icon: BookOpen,
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
