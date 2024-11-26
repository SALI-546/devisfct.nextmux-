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

</head>

<body style="background-image: url('/images/bg.png'); background-size: cover; background-position: center;">

    <!-- Sidebar -->
    @include('components.NavbarEditor')
    @include('components.sidebar')

    <!-- Main Content -->
    <main class="pt-16">
        <div class="">
            @yield('content')
        </div>
    </main>

    <!-- Appelle aux scripts publics -->
    <script src="{{ asset('build/assets/global.js') }}"></script>
</body>

</html>