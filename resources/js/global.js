// Initialize Feather Icons
feather.replace();

document.addEventListener('DOMContentLoaded', () => {
    const dropdownButtonApps = document.getElementById('dropdownButtonApps');
    const dropdownMenuApps = document.getElementById('dropdownMenuApps');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuIcon = document.querySelector('.menu-icon');

    // ==============================================>
    // 1.Fonction pour fermer le menu des applications
    const closeAppsMenu = () => {
        dropdownMenuApps?.classList.add('opacity-0', 'invisible');
    };

    dropdownButtonApps?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = !dropdownMenuApps?.classList.contains('invisible');
        closeAppsMenu();
        if (!isVisible) {
            dropdownMenuApps?.classList.remove('opacity-0', 'invisible');
        }
    });

    // Fermer le menu applications quand on clique ailleurs
    document.addEventListener('click', () => {
        closeAppsMenu();
    });

    // ====================>
    // 2.Mobile Menu Toggle
    mobileMenuToggle?.addEventListener('click', () => {
        menuIcon?.classList.toggle('active');
        mobileSidebar?.classList.toggle('-translate-x-full');
        mobileOverlay?.classList.toggle('hidden');
    });

    mobileOverlay?.addEventListener('click', () => {
        menuIcon?.classList.remove('active');
        mobileSidebar?.classList.add('-translate-x-full');
        mobileOverlay?.classList.add('hidden');
    });

    // Fermer les menus avec "Escape"
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAppsMenu();
            menuIcon?.classList.remove('active');
            mobileSidebar?.classList.add('-translate-x-full');
            mobileOverlay?.classList.add('hidden');
        }
    });
});
