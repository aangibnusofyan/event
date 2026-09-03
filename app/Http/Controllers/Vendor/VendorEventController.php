<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Category;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VendorEventController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Event::where('user_id', $user->id)
            ->with(['category:id,name,slug', 'tickets'])
            ->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'ended') {
                $query->where(function ($q) {
                    $q->where('status', 'ended')
                        ->orWhere(function ($sub) {
                            $sub->where('status', '!=', 'draft')
                                ->where('status', '!=', 'cancelled')
                                ->where('end_date_time', '<', now());
                        });
                });
            } elseif ($request->status === 'published') {
                $query->where('status', 'published')
                    ->where('end_date_time', '>=', now());
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('event_type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('venue_name', 'like', "%{$search}%");
            });
        }

        $events = $query->paginate(12)->withQueryString();

        // Calculate stats
        $allVendorEvents = Event::where('user_id', $user->id)->with('tickets')->get();
        $totalTicketsSold = $allVendorEvents->flatMap->tickets->sum('quantity_sold');
        $estimatedRevenue = $allVendorEvents->flatMap->tickets->sum(function ($ticket) {
            return $ticket->quantity_sold * $ticket->price;
        });

        $publishedCount = $allVendorEvents->filter(function ($e) {
            return $e->status === 'published' && $e->end_date_time->isFuture();
        })->count();

        $endedCount = $allVendorEvents->filter(function ($e) {
            return $e->status === 'ended' || ($e->status !== 'draft' && $e->status !== 'cancelled' && $e->end_date_time->isPast());
        })->count();

        $stats = [
            'totalEvents' => $allVendorEvents->count(),
            'publishedEvents' => $publishedCount,
            'draftEvents' => $allVendorEvents->where('status', 'draft')->count(),
            'endedEvents' => $endedCount,
            'totalTicketsSold' => $totalTicketsSold,
            'estimatedRevenue' => 'Rp '.number_format($estimatedRevenue, 0, ',', '.'),
        ];

        return Inertia::render('vendor/events/index', [
            'events' => $events,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('vendor/events/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $slugBase = Str::slug($data['title']);
        $slug = $slugBase;
        $counter = 1;
        while (Event::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$counter}";
            $counter++;
        }

        DB::transaction(function () use ($user, $data, $slug) {
            $event = Event::create([
                'user_id' => $user->id,
                'category_id' => $data['category_id'],
                'title' => $data['title'],
                'slug' => $slug,
                'summary' => $data['summary'] ?? null,
                'description' => $data['description'] ?? null,
                'banner_image' => $data['banner_image'] ?? null,
                'event_type' => $data['event_type'],
                'status' => $data['status'],
                'start_date_time' => Carbon::parse($data['start_date_time'])->toDateTimeString(),
                'end_date_time' => Carbon::parse($data['end_date_time'])->toDateTimeString(),
                'timezone' => $data['timezone'] ?? 'Asia/Jakarta',

                'online_platform' => $data['online_platform'] ?? null,
                'streaming_link' => $data['streaming_link'] ?? null,
                'streaming_instructions' => $data['streaming_instructions'] ?? null,

                'venue_name' => $data['venue_name'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'province' => $data['province'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'google_maps_url' => $data['google_maps_url'] ?? null,
            ]);

            // Create Tickets
            foreach ($data['tickets'] as $ticketData) {
                $saleStartDate = ! empty($ticketData['sale_start_date'])
                    ? Carbon::parse($ticketData['sale_start_date'])->toDateTimeString()
                    : null;
                $saleEndDate = ! empty($ticketData['sale_end_date'])
                    ? Carbon::parse($ticketData['sale_end_date'])->toDateTimeString()
                    : null;

                $event->tickets()->create([
                    'name' => $ticketData['name'],
                    'type' => $ticketData['type'],
                    'tier' => $ticketData['tier'],
                    'price' => $ticketData['type'] === 'free' ? 0 : ($ticketData['price'] ?? 0),
                    'quantity' => $ticketData['quantity'],
                    'min_per_transaction' => $ticketData['min_per_transaction'] ?? 1,
                    'max_per_transaction' => $ticketData['max_per_transaction'] ?? 5,
                    'sale_start_date' => $saleStartDate,
                    'sale_end_date' => $saleEndDate,
                    'description' => $ticketData['description'] ?? null,
                ]);
            }

            // Create Agendas
            if (! empty($data['agendas'])) {
                foreach ($data['agendas'] as $index => $agendaData) {
                    $event->agendas()->create([
                        'title' => $agendaData['title'],
                        'description' => $agendaData['description'] ?? null,
                        'start_time' => $agendaData['start_time'],
                        'end_time' => $agendaData['end_time'],
                        'speaker_name' => $agendaData['speaker_name'] ?? null,
                        'stage_or_room' => $agendaData['stage_or_room'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }

            // Create Speakers
            if (! empty($data['speakers'])) {
                foreach ($data['speakers'] as $index => $speakerData) {
                    $event->speakers()->create([
                        'name' => $speakerData['name'],
                        'role_or_title' => $speakerData['role_or_title'] ?? null,
                        'organization' => $speakerData['organization'] ?? null,
                        'bio' => $speakerData['bio'] ?? null,
                        'avatar' => $speakerData['avatar'] ?? null,
                        'social_links' => $speakerData['social_links'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }

            // Create Sponsors
            if (! empty($data['sponsors'])) {
                foreach ($data['sponsors'] as $index => $sponsorData) {
                    $event->sponsors()->create([
                        'name' => $sponsorData['name'],
                        'tier' => $sponsorData['tier'],
                        'logo' => $sponsorData['logo'] ?? null,
                        'website_url' => $sponsorData['website_url'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }
        });

        return redirect()->route('vendor.events.index')->with('success', 'Event berhasil dibuat!');
    }

    public function show(Event $event): Response
    {
        abort_if($event->user_id !== auth()->id(), 403);

        $event->load([
            'category',
            'tickets',
            'agendas',
            'speakers',
            'sponsors',
            'coupons',
        ]);

        return Inertia::render('vendor/events/show', [
            'event' => $event,
        ]);
    }

    public function edit(Event $event): Response
    {
        abort_if($event->user_id !== auth()->id(), 403);

        $event->load([
            'category',
            'tickets',
            'agendas',
            'speakers',
            'sponsors',
        ]);

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('vendor/events/edit', [
            'event' => $event,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($event, $data) {
            $event->update([
                'category_id' => $data['category_id'],
                'title' => $data['title'],
                'summary' => $data['summary'] ?? null,
                'description' => $data['description'] ?? null,
                'banner_image' => $data['banner_image'] ?? null,
                'event_type' => $data['event_type'],
                'status' => $data['status'],
                'start_date_time' => Carbon::parse($data['start_date_time'])->toDateTimeString(),
                'end_date_time' => Carbon::parse($data['end_date_time'])->toDateTimeString(),
                'timezone' => $data['timezone'] ?? 'Asia/Jakarta',

                'online_platform' => $data['online_platform'] ?? null,
                'streaming_link' => $data['streaming_link'] ?? null,
                'streaming_instructions' => $data['streaming_instructions'] ?? null,

                'venue_name' => $data['venue_name'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'province' => $data['province'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'google_maps_url' => $data['google_maps_url'] ?? null,
            ]);

            // Sync tickets
            $incomingTicketIds = collect($data['tickets'])->pluck('id')->filter()->all();
            $event->tickets()->whereNotIn('id', $incomingTicketIds)->delete();

            foreach ($data['tickets'] as $ticketData) {
                $saleStartDate = ! empty($ticketData['sale_start_date'])
                    ? Carbon::parse($ticketData['sale_start_date'])->toDateTimeString()
                    : null;
                $saleEndDate = ! empty($ticketData['sale_end_date'])
                    ? Carbon::parse($ticketData['sale_end_date'])->toDateTimeString()
                    : null;

                $ticketAttributes = [
                    'name' => $ticketData['name'],
                    'type' => $ticketData['type'],
                    'tier' => $ticketData['tier'],
                    'price' => $ticketData['type'] === 'free' ? 0 : ($ticketData['price'] ?? 0),
                    'quantity' => $ticketData['quantity'],
                    'min_per_transaction' => $ticketData['min_per_transaction'] ?? 1,
                    'max_per_transaction' => $ticketData['max_per_transaction'] ?? 5,
                    'sale_start_date' => $saleStartDate,
                    'sale_end_date' => $saleEndDate,
                    'description' => $ticketData['description'] ?? null,
                ];

                if (! empty($ticketData['id'])) {
                    $event->tickets()->where('id', $ticketData['id'])->update($ticketAttributes);
                } else {
                    $event->tickets()->create($ticketAttributes);
                }
            }

            // Sync agendas (recreate)
            $event->agendas()->delete();
            if (! empty($data['agendas'])) {
                foreach ($data['agendas'] as $index => $agendaData) {
                    $event->agendas()->create([
                        'title' => $agendaData['title'],
                        'description' => $agendaData['description'] ?? null,
                        'start_time' => $agendaData['start_time'],
                        'end_time' => $agendaData['end_time'],
                        'speaker_name' => $agendaData['speaker_name'] ?? null,
                        'stage_or_room' => $agendaData['stage_or_room'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }

            // Sync speakers (recreate)
            $event->speakers()->delete();
            if (! empty($data['speakers'])) {
                foreach ($data['speakers'] as $index => $speakerData) {
                    $event->speakers()->create([
                        'name' => $speakerData['name'],
                        'role_or_title' => $speakerData['role_or_title'] ?? null,
                        'organization' => $speakerData['organization'] ?? null,
                        'bio' => $speakerData['bio'] ?? null,
                        'avatar' => $speakerData['avatar'] ?? null,
                        'social_links' => $speakerData['social_links'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }

            // Sync sponsors (recreate)
            $event->sponsors()->delete();
            if (! empty($data['sponsors'])) {
                foreach ($data['sponsors'] as $index => $sponsorData) {
                    $event->sponsors()->create([
                        'name' => $sponsorData['name'],
                        'tier' => $sponsorData['tier'],
                        'logo' => $sponsorData['logo'] ?? null,
                        'website_url' => $sponsorData['website_url'] ?? null,
                        'order' => $index + 1,
                    ]);
                }
            }
        });

        return redirect()->route('vendor.events.index')->with('success', 'Event berhasil diperbarui!');
    }

    public function destroy(Event $event): RedirectResponse
    {
        abort_if($event->user_id !== auth()->id(), 403);

        $event->delete();

        return redirect()->route('vendor.events.index')->with('success', 'Event berhasil dihapus!');
    }

    public function duplicate(Event $event): RedirectResponse
    {
        abort_if($event->user_id !== auth()->id(), 403);

        $event->load(['tickets', 'agendas', 'speakers', 'sponsors']);

        $newSlug = Str::slug($event->title.'-copy-'.Str::random(5));

        $newEvent = DB::transaction(function () use ($event, $newSlug) {
            $clone = $event->replicate([
                'slug',
                'status',
            ]);
            $clone->title = "{$event->title} (Salinan)";
            $clone->slug = $newSlug;
            $clone->status = 'draft';
            $clone->save();

            foreach ($event->tickets as $ticket) {
                $ticketClone = $ticket->replicate(['quantity_sold']);
                $ticketClone->quantity_sold = 0;
                $ticketClone->event_id = $clone->id;
                $ticketClone->save();
            }

            foreach ($event->agendas as $agenda) {
                $agendaClone = $agenda->replicate();
                $agendaClone->event_id = $clone->id;
                $agendaClone->save();
            }

            foreach ($event->speakers as $speaker) {
                $speakerClone = $speaker->replicate();
                $speakerClone->event_id = $clone->id;
                $speakerClone->save();
            }

            foreach ($event->sponsors as $sponsor) {
                $sponsorClone = $sponsor->replicate();
                $sponsorClone->event_id = $clone->id;
                $sponsorClone->save();
            }

            return $clone;
        });

        return redirect()->route('vendor.events.edit', $newEvent)->with('success', 'Event berhasil diduplikasi sebagai draft!');
    }

    public function toggleStatus(Request $request, Event $event): RedirectResponse
    {
        abort_if($event->user_id !== auth()->id(), 403);

        $request->validate([
            'status' => ['required', 'in:draft,published,ended,cancelled'],
        ]);

        $event->update(['status' => $request->status]);

        return back()->with('success', 'Status event berhasil diperbarui.');
    }
}
