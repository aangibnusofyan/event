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

        $realEvents = $user->events()
            ->with(['category', 'tickets', 'agendas', 'speakers', 'sponsors'])
            ->where('status', 'published')
            ->orderBy('start_date_time')
            ->get();

        $formattedEvents = $realEvents->map(function ($event) {
            $location = match ($event->event_type) {
                'online' => 'Online ('.($event->online_platform ?? 'Streaming').')',
                'hybrid' => 'Hybrid ('.($event->venue_name ?? $event->city ?? 'Venue').' & Online)',
                default => ($event->venue_name ?? $event->city ?? 'Indonesia'),
            };

            $minTicket = $event->tickets->min('price');
            $price = ($minTicket === null || $minTicket == 0)
                ? 'Gratis'
                : 'Rp '.number_format($minTicket, 0, ',', '.');

            $isPast = $event->end_date_time->isPast();

            $bannerImage = $event->banner_image;
            if ($bannerImage && ! str_starts_with($bannerImage, 'http://') && ! str_starts_with($bannerImage, 'https://') && ! str_starts_with($bannerImage, '/')) {
                $bannerImage = '/storage/'.$bannerImage;
            }

            return [
                'id' => $event->id,
                'slug' => $event->slug,
                'title' => $event->title,
                'summary' => $event->summary,
                'description' => $event->description,
                'event_type' => $event->event_type,
                'date' => $event->start_date_time->translatedFormat('d M Y'),
                'time' => $event->start_date_time->format('H:i').' - '.$event->end_date_time->format('H:i').' WIB',
                'start_date_time' => $event->start_date_time->toIso8601String(),
                'end_date_time' => $event->end_date_time->toIso8601String(),
                'timezone' => $event->timezone ?? 'Asia/Jakarta',
                'location' => $location,
                'venue_name' => $event->venue_name,
                'address' => $event->address,
                'city' => $event->city,
                'province' => $event->province,
                'google_maps_url' => $event->google_maps_url,
                'online_platform' => $event->online_platform,
                'streaming_link' => $event->streaming_link,
                'streaming_instructions' => $event->streaming_instructions,
                'price' => $price,
                'category' => $event->category?->name ?? 'Umum',
                'image' => $bannerImage,
                'status' => $isPast ? 'past' : 'upcoming',
                'tickets' => $event->tickets->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'type' => $t->type,
                    'tier' => $t->tier,
                    'price' => $t->type === 'free' ? 0 : (float) $t->price,
                    'formatted_price' => $t->type === 'free' ? 'Gratis' : 'Rp '.number_format($t->price, 0, ',', '.'),
                    'quantity' => $t->quantity,
                    'quantity_sold' => $t->quantity_sold,
                    'remaining' => max(0, $t->quantity - $t->quantity_sold),
                    'description' => $t->description,
                ])->values()->all(),
                'agendas' => $event->agendas->map(fn ($a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'description' => $a->description,
                    'start_time' => $a->start_time,
                    'end_time' => $a->end_time,
                    'speaker_name' => $a->speaker_name,
                    'stage_or_room' => $a->stage_or_room,
                ])->values()->all(),
                'speakers' => $event->speakers->map(fn ($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'role_or_title' => $s->role_or_title,
                    'organization' => $s->organization,
                    'bio' => $s->bio,
                    'avatar' => $s->avatar,
                ])->values()->all(),
                'sponsors' => $event->sponsors->map(fn ($sp) => [
                    'id' => $sp->id,
                    'name' => $sp->name,
                    'tier' => $sp->tier,
                    'logo' => $sp->logo,
                    'website_url' => $sp->website_url,
                ])->values()->all(),
            ];
        })->values()->all();

        return Inertia::render('vendor/show', [
            'vendor' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'avatar' => $user->avatar ? '/storage/'.$user->avatar : null,
                'bio' => $user->about ?? 'Belum ada informasi tentang vendor ini.',
                'location' => 'Jakarta, Indonesia',
                'joinedAt' => $user->created_at->translatedFormat('F Y'),
                'stats' => [
                    'totalEvents' => $realEvents->count(),
                    'totalAttendees' => $user->events->flatMap->tickets->sum('quantity_sold'),
                    'rating' => 4.9,
                ],
                'socialLinks' => $user->social_links ?? [
                    'instagram' => null,
                    'x' => null,
                    'tiktok' => null,
                    'youtube' => null,
                    'website' => null,
                ],
            ],
            'events' => $formattedEvents,
        ]);
    }
}
