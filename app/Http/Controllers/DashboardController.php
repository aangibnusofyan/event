<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCoupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all events for the current vendor
        $allEvents = Event::where('user_id', $user->id)
            ->with(['category:id,name,slug', 'tickets'])
            ->latest()
            ->get();

        $totalTicketsSold = $allEvents->flatMap->tickets->sum('quantity_sold');
        $totalTicketsQuota = $allEvents->flatMap->tickets->sum('quantity');
        $estimatedRevenue = $allEvents->flatMap->tickets->sum(function ($ticket) {
            return $ticket->quantity_sold * $ticket->price;
        });

        $publishedEvents = $allEvents->filter(function ($e) {
            return $e->status === 'published' && $e->end_date_time->isFuture();
        })->values();

        $endedEvents = $allEvents->filter(function ($e) {
            return $e->status === 'ended' || ($e->status !== 'draft' && $e->status !== 'cancelled' && $e->end_date_time->isPast());
        })->values();

        $draftEvents = $allEvents->where('status', 'draft')->values();

        $allCoupons = EventCoupon::where('user_id', $user->id)->latest()->get();
        $activeCoupons = $allCoupons->where('is_active', true)->values();

        $recentEvents = $allEvents->take(6)->map(function ($event) {
            $totalQuota = $event->tickets->sum('quantity');
            $sold = $event->tickets->sum('quantity_sold');
            $minPrice = $event->tickets->min('price');

            $bannerImage = $event->banner_image;
            if ($bannerImage && ! str_starts_with($bannerImage, 'http://') && ! str_starts_with($bannerImage, 'https://') && ! str_starts_with($bannerImage, '/')) {
                $bannerImage = '/storage/'.$bannerImage;
            }

            return [
                'id' => $event->id,
                'title' => $event->title,
                'category' => $event->category?->name ?? 'Event',
                'banner_image' => $bannerImage,
                'event_type' => $event->event_type,
                'status' => $event->status,
                'start_date_time' => $event->start_date_time->toIso8601String(),
                'end_date_time' => $event->end_date_time->toIso8601String(),
                'location' => $event->event_type === 'online'
                    ? ($event->online_platform ?? 'Online')
                    : ($event->venue_name ?? $event->city ?? 'Onsite'),
                'tickets_sold' => $sold,
                'tickets_total' => $totalQuota,
                'price_label' => ($minPrice === null || $minPrice == 0)
                    ? 'Gratis'
                    : 'Rp '.number_format($minPrice, 0, ',', '.'),
            ];
        })->values()->all();

        $recentCoupons = $allCoupons->take(4)->map(function ($c) {
            return [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->name,
                'discount_type' => $c->discount_type,
                'discount_value' => $c->discount_value,
                'discount_label' => $c->discount_type === 'percentage'
                    ? "{$c->discount_value}%"
                    : 'Rp '.number_format($c->discount_value, 0, ',', '.'),
                'usage_count' => $c->usage_count,
                'usage_limit' => $c->usage_limit,
                'is_active' => $c->is_active,
                'expires_at' => $c->end_date ? $c->end_date->translatedFormat('d M Y') : null,
            ];
        })->values()->all();

        return Inertia::render('dashboard', [
            'vendor' => [
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
            'stats' => [
                'totalEvents' => $allEvents->count(),
                'publishedEvents' => $publishedEvents->count(),
                'draftEvents' => $draftEvents->count(),
                'endedEvents' => $endedEvents->count(),
                'totalTicketsSold' => $totalTicketsSold,
                'totalTicketsQuota' => $totalTicketsQuota,
                'estimatedRevenue' => 'Rp '.number_format($estimatedRevenue, 0, ',', '.'),
                'activeCouponsCount' => $activeCoupons->count(),
                'totalCouponsUsed' => $allCoupons->sum('usage_count'),
                'typeBreakdown' => [
                    'online' => $allEvents->where('event_type', 'online')->count(),
                    'offline' => $allEvents->where('event_type', 'offline')->count(),
                    'hybrid' => $allEvents->where('event_type', 'hybrid')->count(),
                ],
            ],
            'recentEvents' => $recentEvents,
            'recentCoupons' => $recentCoupons,
        ]);
    }
}
