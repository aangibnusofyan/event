<?php

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

beforeEach(function () {
    $this->vendor = User::factory()->vendor()->create();
    $this->category = Category::factory()->create();
});

it('prevents unauthenticated users from accessing vendor events', function () {
    $this->get('/vendor/events')
        ->assertRedirect('/login');
});

it('prevents non-vendor users from accessing vendor events', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/vendor/events')
        ->assertForbidden();
});

it('allows vendor to view events index with their events', function () {
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Festival Musik Tahunan',
    ]);

    $this->actingAs($this->vendor)
        ->get('/vendor/events')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/events/index')
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Festival Musik Tahunan')
            ->has('stats')
        );
});

it('allows vendor to view create event page', function () {
    $this->actingAs($this->vendor)
        ->get('/vendor/events/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/events/create')
            ->has('categories')
        );
});

it('allows vendor to create a complete hybrid event with tickets, agendas, speakers, and sponsors', function () {
    $payload = [
        'title' => 'Web3 & AI Summit 2026',
        'category_id' => $this->category->id,
        'summary' => 'Konferensi teknologi terkini',
        'description' => 'Deskripsi lengkap acara',
        'event_type' => 'hybrid',
        'status' => 'published',
        'start_date_time' => now()->addDays(10)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(10)->addHours(8)->format('Y-m-d H:i:s'),
        'timezone' => 'Asia/Jakarta',

        'online_platform' => 'Zoom',
        'streaming_link' => 'https://zoom.us/j/1234567890',
        'streaming_instructions' => 'Passcode: 1234',

        'venue_name' => 'Grand Ballroom Jakarta',
        'address' => 'Jl. Sudirman Kav 1',
        'city' => 'Jakarta Selatan',
        'province' => 'DKI Jakarta',
        'latitude' => -6.2088,
        'longitude' => 106.8456,
        'google_maps_url' => 'https://maps.google.com/?q=-6.2088,106.8456',

        'tickets' => [
            [
                'name' => 'Early Bird Virtual',
                'type' => 'paid',
                'tier' => 'early_bird',
                'price' => 100000,
                'quantity' => 100,
                'min_per_transaction' => 1,
                'max_per_transaction' => 5,
                'description' => 'Akses streaming online',
            ],
            [
                'name' => 'VIP Onsite Pass',
                'type' => 'paid',
                'tier' => 'vip',
                'price' => 500000,
                'quantity' => 30,
                'min_per_transaction' => 1,
                'max_per_transaction' => 2,
                'description' => 'Akses onsite & exclusive lounge',
            ],
        ],

        'agendas' => [
            [
                'title' => 'Keynote Presentation',
                'start_time' => '09:00',
                'end_time' => '10:30',
                'speaker_name' => 'John Doe',
                'stage_or_room' => 'Main Hall',
                'description' => 'Sesi pembuka',
            ],
        ],

        'speakers' => [
            [
                'name' => 'John Doe',
                'role_or_title' => 'Chief Scientist',
                'organization' => 'Tech Corp',
                'bio' => 'Ahli AI',
            ],
        ],

        'sponsors' => [
            [
                'name' => 'Global Cloud Partner',
                'tier' => 'platinum',
                'website_url' => 'https://example.com',
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)
        ->post('/vendor/events', $payload);

    $response->assertRedirect('/vendor/events');

    $this->assertDatabaseHas('events', [
        'user_id' => $this->vendor->id,
        'title' => 'Web3 & AI Summit 2026',
        'event_type' => 'hybrid',
        'status' => 'published',
    ]);

    $event = Event::where('title', 'Web3 & AI Summit 2026')->first();
    expect($event->tickets)->toHaveCount(2)
        ->and($event->agendas)->toHaveCount(1)
        ->and($event->speakers)->toHaveCount(1)
        ->and($event->sponsors)->toHaveCount(1);
});

it('processes, resizes to 16:9, compresses, and stores banner image in isolated vendor folder', function () {
    Storage::fake('public');

    // Create a 2000x1000 test image (non 16:9 to verify auto-fit)
    $bannerFile = UploadedFile::fake()->image('banner_poster.jpg', 2000, 1000)->size(3000);

    $payload = [
        'title' => 'Art & Design Exhibition 2026',
        'category_id' => $this->category->id,
        'summary' => 'Pameran seni tahunan',
        'event_type' => 'offline',
        'status' => 'published',
        'start_date_time' => now()->addDays(5)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(5)->addHours(4)->format('Y-m-d H:i:s'),
        'venue_name' => 'Gallery Hall',
        'city' => 'Bandung',
        'banner_image' => $bannerFile,
        'tickets' => [
            [
                'name' => 'General Admission',
                'type' => 'paid',
                'tier' => 'regular',
                'price' => 50000,
                'quantity' => 150,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)->post('/vendor/events', $payload);
    $response->assertRedirect('/vendor/events');

    $event = Event::where('title', 'Art & Design Exhibition 2026')->first();
    expect($event)->not->toBeNull()
        ->and($event->banner_image)->not->toBeNull()
        ->and($event->banner_image)->toStartWith('/storage/banners/vendor_'.$this->vendor->id.'/');

    $storedRelativePath = Str::after($event->banner_image, '/storage/');
    Storage::disk('public')->assertExists($storedRelativePath);

    // Verify dimensions: 1280x720 (16:9)
    $manager = new ImageManager(new Driver);
    $fullPath = Storage::disk('public')->path($storedRelativePath);
    $processedImage = $manager->decodePath($fullPath);
    expect($processedImage->width())->toBe(1280)
        ->and($processedImage->height())->toBe(720);
});

it('rejects banner image larger than 10MB', function () {
    Storage::fake('public');

    // 11MB file (larger than 10240 KB limit)
    $oversizedFile = UploadedFile::fake()->image('huge_banner.jpg', 1920, 1080)->size(11264);

    $payload = [
        'title' => 'Oversized Banner Event',
        'category_id' => $this->category->id,
        'event_type' => 'offline',
        'status' => 'published',
        'start_date_time' => now()->addDays(2)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(2)->addHours(2)->format('Y-m-d H:i:s'),
        'banner_image' => $oversizedFile,
        'tickets' => [
            [
                'name' => 'Ticket A',
                'type' => 'free',
                'tier' => 'regular',
                'quantity' => 50,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)->post('/vendor/events', $payload);
    $response->assertSessionHasErrors(['banner_image']);
    expect(session('errors')->first('banner_image'))->toBe('Ukuran foto terlalu besar. Maksimal 10MB.');
});

it('rejects banner image with non-image mime type', function () {
    Storage::fake('public');

    $pdfFile = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

    $payload = [
        'title' => 'Invalid Mime Event',
        'category_id' => $this->category->id,
        'event_type' => 'offline',
        'status' => 'published',
        'start_date_time' => now()->addDays(2)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(2)->addHours(2)->format('Y-m-d H:i:s'),
        'banner_image' => $pdfFile,
        'tickets' => [
            [
                'name' => 'Ticket A',
                'type' => 'free',
                'tier' => 'regular',
                'quantity' => 50,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)->post('/vendor/events', $payload);
    $response->assertSessionHasErrors(['banner_image']);
});

it('allows vendor to view their event detail', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Show Detail Event',
    ]);

    $this->actingAs($this->vendor)
        ->get("/vendor/events/{$event->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/events/show')
            ->where('event.id', $event->id)
            ->where('event.title', 'Show Detail Event')
        );
});

it('prevents vendor from viewing another vendors event', function () {
    $otherVendor = User::factory()->vendor()->create();
    $event = Event::factory()->create([
        'user_id' => $otherVendor->id,
        'category_id' => $this->category->id,
    ]);

    $this->actingAs($this->vendor)
        ->get("/vendor/events/{$event->id}")
        ->assertForbidden();
});

it('allows vendor to update an event', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Old Event Title',
    ]);

    $payload = [
        'title' => 'Updated Event Title',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => now()->addDays(5)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(5)->addHours(4)->format('Y-m-d H:i:s'),
        'tickets' => [
            [
                'name' => 'Free Pass',
                'type' => 'free',
                'tier' => 'regular',
                'price' => 0,
                'quantity' => 150,
            ],
        ],
    ];

    $this->actingAs($this->vendor)
        ->put("/vendor/events/{$event->id}", $payload)
        ->assertRedirect('/vendor/events');

    $this->assertDatabaseHas('events', [
        'id' => $event->id,
        'title' => 'Updated Event Title',
        'event_type' => 'online',
    ]);
});

it('replaces old banner when updating event with a new banner image', function () {
    Storage::fake('public');

    // Seed old banner
    $oldBannerPath = 'banners/vendor_'.$this->vendor->id.'/old_banner.webp';
    Storage::disk('public')->put($oldBannerPath, 'fake-image-content');

    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Event With Old Banner',
        'banner_image' => '/storage/'.$oldBannerPath,
    ]);

    $newBanner = UploadedFile::fake()->image('new_banner.png', 1600, 900);

    $payload = [
        'title' => 'Event With Replaced Banner',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => now()->addDays(5)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(5)->addHours(4)->format('Y-m-d H:i:s'),
        'banner_image' => $newBanner,
        'tickets' => [
            [
                'name' => 'Free Pass',
                'type' => 'free',
                'tier' => 'regular',
                'price' => 0,
                'quantity' => 50,
            ],
        ],
    ];

    $this->actingAs($this->vendor)
        ->put("/vendor/events/{$event->id}", $payload)
        ->assertRedirect('/vendor/events');

    $event->refresh();
    expect($event->banner_image)->not->toBe('/storage/'.$oldBannerPath)
        ->and($event->banner_image)->toStartWith('/storage/banners/vendor_'.$this->vendor->id.'/');

    // Old banner deleted
    Storage::disk('public')->assertMissing($oldBannerPath);

    // New banner exists
    Storage::disk('public')->assertExists(Str::after($event->banner_image, '/storage/'));
});

it('allows vendor to update an event with ISO 8601 ticket sale dates', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Event With Tickets',
    ]);

    $ticket = $event->tickets()->create([
        'name' => 'Regular Pass',
        'type' => 'paid',
        'tier' => 'regular',
        'price' => 150000,
        'quantity' => 100,
        'sale_start_date' => now(),
        'sale_end_date' => now()->addMonth(),
    ]);

    $payload = [
        'title' => 'Event With Tickets Updated',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => '2026-10-15T09:00',
        'end_date_time' => '2026-10-15T17:00',
        'tickets' => [
            [
                'id' => $ticket->id,
                'name' => 'Regular Pass',
                'type' => 'paid',
                'tier' => 'regular',
                'price' => '150000.00',
                'quantity' => 100,
                'min_per_transaction' => 1,
                'max_per_transaction' => 2,
                'sale_start_date' => '2026-09-03T17:35:00.000000Z',
                'sale_end_date' => '2026-09-30T17:36:00.000000Z',
            ],
        ],
    ];

    $this->actingAs($this->vendor)
        ->put("/vendor/events/{$event->id}", $payload)
        ->assertRedirect('/vendor/events');

    $this->assertDatabaseHas('event_tickets', [
        'id' => $ticket->id,
        'sale_start_date' => '2026-09-03 17:35:00',
        'sale_end_date' => '2026-09-30 17:36:00',
    ]);
});

it('allows vendor to duplicate an event', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Event to Duplicate',
    ]);

    $this->actingAs($this->vendor)
        ->post("/vendor/events/{$event->id}/duplicate")
        ->assertRedirect();

    $this->assertDatabaseHas('events', [
        'user_id' => $this->vendor->id,
        'title' => 'Event to Duplicate (Salinan)',
        'status' => 'draft',
    ]);
});

it('allows vendor to toggle event status', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'status' => 'published',
    ]);

    $this->actingAs($this->vendor)
        ->patch("/vendor/events/{$event->id}/status", [
            'status' => 'draft',
        ])
        ->assertRedirect();

    expect($event->fresh()->status)->toBe('draft');
});

it('allows vendor to delete an event', function () {
    $event = Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
    ]);

    $this->actingAs($this->vendor)
        ->delete("/vendor/events/{$event->id}")
        ->assertRedirect('/vendor/events');

    $this->assertDatabaseMissing('events', [
        'id' => $event->id,
    ]);
});

it('correctly filters ended events by status or past end date', function () {
    // Active future published event
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Future Event',
        'status' => 'published',
        'start_date_time' => now()->addDays(5),
        'end_date_time' => now()->addDays(5)->addHours(4),
    ]);

    // Past event (end_date_time has passed)
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Past Ended Event',
        'status' => 'published',
        'start_date_time' => now()->subDays(5),
        'end_date_time' => now()->subDays(5)->addHours(4),
    ]);

    // Explicitly marked ended event
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Explicit Ended Event',
        'status' => 'ended',
        'start_date_time' => now()->addDays(2),
        'end_date_time' => now()->addDays(2)->addHours(2),
    ]);

    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=ended')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/events/index')
            ->has('events.data', 2)
            ->where('events.data.0.title', fn ($title) => in_array($title, ['Past Ended Event', 'Explicit Ended Event']))
        );
});

it('correctly filters all combinations of status and type', function () {
    // 1. Published Online (Future)
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Webinar AI Content',
        'status' => 'published',
        'event_type' => 'online',
        'start_date_time' => now()->addDays(10),
        'end_date_time' => now()->addDays(10)->addHours(2),
    ]);

    // 2. Published Offline (Future)
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Workshop UI/UX Design',
        'status' => 'published',
        'event_type' => 'offline',
        'start_date_time' => now()->addDays(12),
        'end_date_time' => now()->addDays(12)->addHours(3),
    ]);

    // 3. Draft Offline
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Draft Konser Jazz',
        'status' => 'draft',
        'event_type' => 'offline',
        'start_date_time' => now()->addDays(20),
        'end_date_time' => now()->addDays(20)->addHours(5),
    ]);

    // 4. Ended Offline (past end_date_time)
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Java Jazz 2026',
        'status' => 'published',
        'event_type' => 'offline',
        'start_date_time' => now()->subMonths(2),
        'end_date_time' => now()->subMonths(2)->addDays(2),
    ]);

    // 5. Ended Online (status = ended)
    Event::factory()->create([
        'user_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'title' => 'Webinar SEO 2026',
        'status' => 'ended',
        'event_type' => 'online',
        'start_date_time' => now()->subDays(10),
        'end_date_time' => now()->subDays(10)->addHours(2),
    ]);

    // Test: status=published & type=online -> Webinar AI Content
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=published&type=online')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Webinar AI Content')
        );

    // Test: status=published & type=offline -> Workshop UI/UX Design
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=published&type=offline')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Workshop UI/UX Design')
        );

    // Test: status=ended & type=offline -> Java Jazz 2026
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=ended&type=offline')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Java Jazz 2026')
        );

    // Test: status=ended & type=online -> Webinar SEO 2026
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=ended&type=online')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Webinar SEO 2026')
        );

    // Test: status=draft & type=offline -> Draft Konser Jazz
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=draft&type=offline')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Draft Konser Jazz')
        );

    // Test: status=all & type=offline -> 3 events (Workshop, Draft, Java Jazz)
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=all&type=offline')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 3)
        );

    // Test: status=all & type=all -> 5 events
    $this->actingAs($this->vendor)
        ->get('/vendor/events?status=all&type=all')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('events.data', 5)
        );
});

it('allows creating an event without latitude and longitude', function () {
    $payload = [
        'title' => 'No Lat Long Event',
        'category_id' => $this->category->id,
        'event_type' => 'offline',
        'status' => 'published',
        'start_date_time' => now()->addDays(2)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(2)->addHours(3)->format('Y-m-d H:i:s'),
        'venue_name' => 'City Convention Center',
        'city' => 'Jakarta Selatan',
        'province' => 'DKI Jakarta',
        'address' => 'Jl. Gatot Subroto No. 123',
        'google_maps_url' => 'https://maps.google.com/?q=jakarta',
        'latitude' => null,
        'longitude' => null,
        'tickets' => [
            [
                'name' => 'Regular Ticket',
                'type' => 'paid',
                'tier' => 'regular',
                'price' => 50000,
                'quantity' => 100,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)
        ->post('/vendor/events', $payload);

    $response->assertRedirect('/vendor/events');

    $this->assertDatabaseHas('events', [
        'user_id' => $this->vendor->id,
        'title' => 'No Lat Long Event',
        'latitude' => null,
        'longitude' => null,
        'venue_name' => 'City Convention Center',
    ]);
});

it('uploads, crops square 1:1, and compresses speaker avatar', function () {
    Storage::fake('public');

    // Create a 1200x800 non-square image
    $avatarFile = UploadedFile::fake()->image('speaker_photo.jpg', 1200, 800)->size(1500);

    $payload = [
        'title' => 'Event With Uploaded Speaker',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(3)->addHours(2)->format('Y-m-d H:i:s'),
        'online_platform' => 'Zoom Meetings',
        'streaming_link' => 'https://zoom.us/j/999',
        'tickets' => [
            [
                'name' => 'Online Pass',
                'type' => 'free',
                'tier' => 'regular',
                'quantity' => 50,
            ],
        ],
        'speakers' => [
            [
                'name' => 'Prof. Anindya',
                'role_or_title' => 'AI Researcher',
                'organization' => 'Tech University',
                'bio' => 'Peneliti AI terkemuka',
                'avatar' => $avatarFile,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)
        ->post('/vendor/events', $payload);

    $response->assertRedirect('/vendor/events');

    $event = Event::where('title', 'Event With Uploaded Speaker')->first();
    expect($event->speakers)->toHaveCount(1);

    $speaker = $event->speakers->first();
    expect($speaker->avatar)->not->toBeNull()
        ->and($speaker->avatar)->toStartWith('/storage/speakers/vendor_'.$this->vendor->id.'/');

    $storedPath = Str::after($speaker->avatar, '/storage/');
    Storage::disk('public')->assertExists($storedPath);

    // Verify 1:1 square crop: 500x500
    $manager = new ImageManager(new Driver);
    $img = $manager->decodePath(Storage::disk('public')->path($storedPath));
    expect($img->width())->toBe(500)
        ->and($img->height())->toBe(500);
});

it('uploads, proportionally resizes (max 800px), and compresses sponsor logo', function () {
    Storage::fake('public');

    // Create a 1600x900 image (wider than 800px)
    $logoFile = UploadedFile::fake()->image('sponsor_logo.png', 1600, 900)->size(2000);

    $payload = [
        'title' => 'Event With Uploaded Sponsor',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(3)->addHours(2)->format('Y-m-d H:i:s'),
        'tickets' => [
            [
                'name' => 'Pass',
                'type' => 'free',
                'tier' => 'regular',
                'quantity' => 50,
            ],
        ],
        'sponsors' => [
            [
                'name' => 'Tech Corp Global',
                'tier' => 'gold',
                'website_url' => 'https://techcorp.com',
                'logo' => $logoFile,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)
        ->post('/vendor/events', $payload);

    $response->assertRedirect('/vendor/events');

    $event = Event::where('title', 'Event With Uploaded Sponsor')->first();
    expect($event->sponsors)->toHaveCount(1);

    $sponsor = $event->sponsors->first();
    expect($sponsor->logo)->not->toBeNull()
        ->and($sponsor->logo)->toStartWith('/storage/sponsors/vendor_'.$this->vendor->id.'/');

    $storedPath = Str::after($sponsor->logo, '/storage/');
    Storage::disk('public')->assertExists($storedPath);

    // Verify proportional scaling with max width 800px (1600x900 -> 800x450)
    $manager = new ImageManager(new Driver);
    $img = $manager->decodePath(Storage::disk('public')->path($storedPath));
    expect($img->width())->toBe(800)
        ->and($img->height())->toBe(450);
});

it('rejects speaker avatar or sponsor logo larger than 10MB', function () {
    Storage::fake('public');

    $oversizedFile = UploadedFile::fake()->image('huge.jpg', 1200, 800)->size(11000);

    $payload = [
        'title' => 'Oversized Media Event',
        'category_id' => $this->category->id,
        'event_type' => 'online',
        'status' => 'published',
        'start_date_time' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'end_date_time' => now()->addDays(3)->addHours(2)->format('Y-m-d H:i:s'),
        'tickets' => [
            [
                'name' => 'Pass',
                'type' => 'free',
                'tier' => 'regular',
                'quantity' => 50,
            ],
        ],
        'speakers' => [
            [
                'name' => 'Speaker A',
                'avatar' => $oversizedFile,
            ],
        ],
    ];

    $response = $this->actingAs($this->vendor)
        ->post('/vendor/events', $payload);

    $response->assertSessionHasErrors(['speakers.0.avatar']);
});
