<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Str;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */

    //  code lama
    // public function share(Request $request): array
    // {
    //     [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

    //     return [
    //         ...parent::share($request),
    //         'name' => config('app.name'),
    //         'quote' => ['message' => trim($message), 'author' => trim($author)],
    //         'auth' => [
    //             'user' => $request->user(),
    //         ],
    //         'ziggy' => fn (): array => [
    //             ...(new Ziggy)->toArray(),
    //             'location' => $request->url(),
    //         ]
    //     ];
    // }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $ziggy = new Ziggy();

        $ziggyArray = $ziggy->toArray();

        // Daftar prefix atau uri yang ingin disembunyikan
        $hiddenPrefixes = [
            'dashboard',
            'web-option',
            'package-type',
            'package-category',
            'package-schedule',
            'package',
            'airline',
            'airport',
            'hotel',
            'login/google',
            'login/google/callback',
            // 'umrahpackages',
            // 'home',
            'oauth',
            'settings',
            'login',
            'register',
            'forgot-password',
            'reset-password',
            'confirm-password',
            'verify-email',
            'email/verification-notification',
            'storage',
            'logout',
            'sanctum/csrf-cookie',
        ];

        $ziggyArray['routes'] = collect($ziggyArray['routes'])
            ->filter(function ($route) use ($hiddenPrefixes) {
                // Cek jika route uri tidak diawali prefix apapun di hiddenPrefixes
                foreach ($hiddenPrefixes as $prefix) {
                    if (Str::startsWith($route['uri'], $prefix)) {
                        return false; // sembunyikan route ini
                    }
                }
                return true; // tampilkan route ini
            })
            ->values()
            ->toArray();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...$ziggyArray,
                'location' => $request->url(),
            ],
        ];
    }
}
