<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class VendorProfileController extends Controller
{
    public function show(string $username): Response
    {
        $user = User::where('username', $username)
            ->where('role', 'vendor')
            ->firstOrFail();

        return Inertia::render('vendor/show', [
            'vendor' => [
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar ? '/storage/'.$user->avatar : null,
                'bio' => $user->about ?? 'Belum ada informasi tentang vendor ini.',
                'location' => 'Jakarta, Indonesia',
                'joinedAt' => $user->created_at->translatedFormat('F Y'),
                'stats' => [
                    'totalEvents' => 24,
                    'totalAttendees' => 12500,
                    'rating' => 4.8,
                ],
                'socialLinks' => [
                    'instagram' => '#',
                    'twitter' => '#',
                    'website' => '#',
                ],
            ],
            'events' => [
                [
                    'id' => 1,
                    'title' => 'Jakarta Music Festival 2026',
                    'date' => '15 Sep 2026',
                    'time' => '18:00 WIB',
                    'location' => 'Gelora Bung Karno, Jakarta',
                    'price' => 'Rp 250.000',
                    'category' => 'Musik',
                    'image' => null,
                    'status' => 'upcoming',
                ],
                [
                    'id' => 2,
                    'title' => 'Tech Summit Indonesia',
                    'date' => '20 Okt 2026',
                    'time' => '09:00 WIB',
                    'location' => 'ICE BSD, Tangerang',
                    'price' => 'Rp 500.000',
                    'category' => 'Teknologi',
                    'image' => null,
                    'status' => 'upcoming',
                ],
                [
                    'id' => 3,
                    'title' => 'Workshop UI/UX Design',
                    'date' => '05 Nov 2026',
                    'time' => '10:00 WIB',
                    'location' => 'WeWork, Jakarta Selatan',
                    'price' => 'Rp 150.000',
                    'category' => 'Workshop',
                    'image' => null,
                    'status' => 'upcoming',
                ],
                [
                    'id' => 4,
                    'title' => 'Food & Culture Festival',
                    'date' => '12 Nov 2026',
                    'time' => '11:00 WIB',
                    'location' => 'Senayan Park, Jakarta',
                    'price' => 'Gratis',
                    'category' => 'Festival',
                    'image' => null,
                    'status' => 'upcoming',
                ],
                [
                    'id' => 5,
                    'title' => 'Startup Networking Night',
                    'date' => '25 Agu 2026',
                    'time' => '19:00 WIB',
                    'location' => 'Block71, Jakarta',
                    'price' => 'Rp 75.000',
                    'category' => 'Networking',
                    'image' => null,
                    'status' => 'past',
                ],
                [
                    'id' => 6,
                    'title' => 'Photography Masterclass',
                    'date' => '10 Agu 2026',
                    'time' => '13:00 WIB',
                    'location' => 'Komunitas Salihara, Jakarta',
                    'price' => 'Rp 200.000',
                    'category' => 'Workshop',
                    'image' => null,
                    'status' => 'past',
                ],
            ],
        ]);
    }
}
