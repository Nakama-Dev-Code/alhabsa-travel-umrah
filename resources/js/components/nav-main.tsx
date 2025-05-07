import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    // Kelompokkan berdasarkan label
    const grouped = items.reduce((acc: Record<string, NavItem[]>, item) => {
        const label = item.label || 'Lainnya';
        acc[label] = acc[label] || [];
        acc[label].push(item);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(grouped).map(([label, groupItems]) => (
                <SidebarGroup key={label} className="px-2 py-0">
                    <SidebarGroupLabel>{label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {groupItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href === page.url}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
