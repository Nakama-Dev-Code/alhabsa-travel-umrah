import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpenCheck, ChartBarStacked, Hotel, LayoutGrid, MapPin, NotebookText, Plane, Settings2, SquareLibrary } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // Platform
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        label: 'Platform',
    },
    {
        title: 'Paket Umrah',
        href: '/umrah-package',
        icon: NotebookText,
        label: 'Platform',
    },
    {
        title: 'Web Option',
        href: '/web-option',
        icon: Settings2,
        label: 'Platform',
    },

    // Manajemen Paket
    {
        title: 'Tipe Paket',
        href: '/package-type',
        icon: SquareLibrary,
        label: 'Manajemen Paket',
    },
    {
        title: 'Kategori Paket',
        href: '/category-package',
        icon: ChartBarStacked,
        label: 'Manajemen Paket',
    },
    {
        title: 'Paket',
        href: '/package',
        icon: BookOpenCheck,
        label: 'Manajemen Paket',
    },

    // Manajemen Penerbangan
    {
        title: 'Airport',
        href: '/airport',
        icon: MapPin,
        label: 'Manajemen Penerbangan',
    },
    {
        title: 'Airline',
        href: '/airline',
        icon: Plane,
        label: 'Manajemen Penerbangan',
    },

    // Manajemen Hotel
    {
        title: 'Hotel',
        href: '/hotel',
        icon: Hotel,
        label: 'Manajemen Hotel',
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
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
