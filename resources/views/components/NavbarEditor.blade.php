<header class="fixed w-full z-50 bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo & Mobile Toggle -->
        <div class="flex items-center space-x-4 w-full">
            <!-- Desktop Logo -->
            <div class="hidden md:block relative w-32 h-10">
                <img src="{{ asset('images/logo/Nextmux.png') }}" alt="Nextmux.Services" class="h-10 object-contain">
            </div>

            <!-- Mobile Navigation -->
            <div class="md:hidden flex justify-between items-center w-full">
                <button id="mobileMenuToggle" class="z-50">
                    <div class="menu-icon">
                        <span class="line line1"></span>
                        <span class="line line2"></span>
                        <span class="line line3"></span>
                    </div>
                </button>

                <img src="{{ asset('images/logo/Nextmux.png') }}" alt="Nextmux.Services" class="h-8 object-contain">

                <div class="w-8"></div> <!-- Spacer pour équilibrer -->
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-6 ml-8">
                <a href="{{ route('dashboard') }}" class="flex items-center space-x-2 {{ request()->is('dashboard') ? 'text-nextmux-green' : 'text-gray-700 hover:text-nextmux-green' }} transition-colors group">
                    <i data-feather="home" class="w-5 h-5 {{ request()->is('dashboard') ? 'text-nextmux-green' : 'group-hover:text-nextmux-green' }}"></i>
                    <span>Accueil</span>
                </a>
                <a href="{{ route('devis.index') }}" class="flex items-center space-x-2 {{ request()->routeIs('devis.*') ? 'text-nextmux-green' : 'text-gray-700 hover:text-nextmux-green' }} transition-colors group">
                    <i data-feather="file-text" class="w-5 h-5 {{ request()->routeIs('devis.*') ? 'text-nextmux-green' : 'group-hover:text-nextmux-green' }}"></i>
                    <span>Devis</span>
                </a>
                <a href="{{ route('factures.index') }}" class="flex items-center space-x-2 {{ request()->routeIs('factures.*') ? 'text-nextmux-green' : 'text-gray-700 hover:text-nextmux-green' }} transition-colors group">
                    <i data-feather="file" class="w-5 h-5 {{ request()->routeIs('factures.*') ? 'text-nextmux-green' : 'group-hover:text-nextmux-green' }}"></i>
                    <span>Factures</span>
                </a>
                <a href="{{ route('projets.index') }}" class="flex items-center space-x-2 {{ request()->routeIs('projets.*') ? 'text-nextmux-green' : 'text-gray-700 hover:text-nextmux-green' }} transition-colors group">
                    <i data-feather="folder" class="w-5 h-5 {{ request()->routeIs('projets.*') ? 'text-nextmux-green' : 'group-hover:text-nextmux-green' }}"></i>
                    <span>Projets</span>
                </a>
            </nav>
        </div>

        <div class="flex items-center space-x-4">
            <!-- Profil icon and link (non visible sur mobile) -->
            <a href="/profile" class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg hidden md:flex"
                title="Mon profil Nextmux">
                <i class="w-6 h-6 text-gray-800" data-feather="user"></i>
            </a>
            <!-- Applications (neuf points) -->
            <div class="relative">
                <button id="dropdownButtonApps" class="flex items-center justify-center hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <div class="grid grid-cols-3 gap-1 w-6 h-6">
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                    </div>
                </button>

                <!-- Menu des applications -->
                <div id="dropdownMenuApps" class="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 invisible transition-all duration-300 ease-out origin-top-right">
                    <div class="p-4">
                        <div class="grid grid-cols-3 gap-4">
                            <!-- Business -->
                            <a href="nextmux-store" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/business.png') }}" alt="Business" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Business</span>
                            </a>

                            <!-- Cloud -->
                            <a href="#" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/cloud.png') }}" alt="Cloud" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Cloud</span>
                            </a>

                            <!-- Connect -->
                            <a href="nextmux-account" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/connect.png') }}" alt="Connect" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Connect</span>
                            </a>

                            <!-- Guard -->
                            <a href="#" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/guard.png') }}" alt="Guard" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Guard</span>
                            </a>

                            <!-- Learn -->
                            <a href="{{ url('my-easy-classrooms') }}" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/learn.png') }}" alt="Learn" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Learn</span>
                            </a>

                            <!-- Pay -->
                            <a href="{{ url('nextmux-pay') }}" class="app-item flex flex-col items-center p-2 rounded-xl hover:bg-gray-100 transition">
                                <img src="{{ asset('images/the-services/pay.png') }}" alt="Pay" class="icon w-10 h-10 mb-1.5">
                                <span class="label text-sm font-medium text-gray-600">Pay</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Slide-Over Menu -->
    <div id="mobileSidebar" class="fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform -translate-x-full transition-transform duration-500 ease-in-out z-40 md:hidden">
        <div class="h-full overflow-y-auto pt-16">
            <!-- Mobile User Profile -->
            <a href="#" class="block">
                <div class="px-6 py-5 border-b flex items-center space-x-4 hover:bg-gray-200">
                    <i data-feather="user" class="w-8 h-8"></i>
                    <div>
                        <p class="font-semibold text-gray-800 text-2xl">Mon Compte</p>
                    </div>
                </div>
            </a>

            <!-- Mobile Navigation Links -->
            <nav class="py-4">
                <a href="{{ route('dashboard') }}" class="block px-6 py-4 flex items-center space-x-3 {{ request()->routeIs('dashboard') ? 'bg-gray-100 text-nextmux-green' : 'hover:bg-gray-100 text-gray-700' }}">
                    <i data-feather="home" class="w-5 h-5"></i>
                    <span>Accueil</span>
                </a>
                <a href="{{ route('devis.index') }}" class="block px-6 py-4 flex items-center space-x-3 {{ request()->routeIs('devis.*') ? 'bg-gray-100 text-nextmux-green' : 'hover:bg-gray-100 text-gray-700' }}">
                    <i data-feather="file-text" class="w-5 h-5"></i>
                    <span>Devis</span>
                </a>
                <a href="{{ route('factures.index') }}" class="block px-6 py-4 flex items-center space-x-3 {{ request()->routeIs('factures.*') ? 'bg-gray-100 text-nextmux-green' : 'hover:bg-gray-100 text-gray-700' }}">
                    <i data-feather="file" class="w-5 h-5"></i>
                    <span>Factures</span>
                </a>
                <a href="{{ route('projets.index') }}" class="block px-6 py-4 flex items-center space-x-3 {{ request()->routeIs('projets.*') ? 'bg-gray-100 text-nextmux-green' : 'hover:bg-gray-100 text-gray-700' }}">
                    <i data-feather="folder" class="w-5 h-5"></i>
                    <span>Projets</span>
                </a>
            </nav>

            <!-- Mobile Menu Footer -->
            <div class="absolute bottom-0 left-0 right-0 p-6 border-t">
                &copy; DevisFact - Tous droits réservés
            </div>
        </div>
    </div>

    <!-- Mobile Overlay -->
    <div id="mobileOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden"></div>
</header>