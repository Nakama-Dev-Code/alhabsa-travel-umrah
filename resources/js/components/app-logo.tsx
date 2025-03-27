export default function AppLogo() {
    return (
        <>
            <div className="bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <img src="/img/alhabsalogo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Al Habsa</span>
            </div>
        </>
    );
}
