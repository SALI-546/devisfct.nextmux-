<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'DevisFact'))</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chart.js/3.7.0/chart.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.29.0/feather.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease-in-out;
            }

            .sidebar.active {
                transform: translateX(0);
            }
        }
    </style>
</head>

<body style="background-image: url('/images/bg.png'); background-size: cover; background-position: center;">
    <!-- Header -->
    @include('components.header')
    <!-- Sidebar -->
    @include('components.sidebar')

    <!-- Main Content -->
    <main class="pt-20 p-6">
        <div class="mt-6">
            @yield('content')
        </div>
    </main>

    <!-- Appelle aux scripts publics -->
    <script src="{{ asset('build/assets/global.js') }}"></script>
</body>

</html>