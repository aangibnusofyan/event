<?php

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('can view a vendor profile page', function () {
    $vendor = User::factory()->create([
        'username' => 'testevent',
        'role' => 'vendor',
    ]);

    $this->get("/{$vendor->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/show')
            ->where('vendor.name', $vendor->name)
            ->where('vendor.username', $vendor->username)
            ->has('events'),
        );
});

it('includes full event details with tickets and rundown on vendor profile', function () {
    $vendor = User::factory()->create([
        'username' => 'eventorganizer',
        'role' => 'vendor',
    ]);

    $category = Category::factory()->create();

    $event = Event::factory()->create([
        'user_id' => $vendor->id,
        'category_id' => $category->id,
        'title' => 'Festival AI 2026',
        'description' => '<p>Deskripsi festival</p>',
        'event_type' => 'online',
        'streaming_link' => 'https://zoom.us/j/1234567890',
        'online_platform' => 'Zoom Meetings',
        'status' => 'published',
        'start_date_time' => now()->addDays(5),
        'end_date_time' => now()->addDays(5)->addHours(8),
    ]);

    $event->tickets()->create([
        'name' => 'VIP Ticket',
        'type' => 'paid',
        'tier' => 'vip',
        'price' => 250000,
        'quantity' => 50,
    ]);

    $event->agendas()->create([
        'title' => 'Keynote Presentation',
        'start_time' => '10:00',
        'end_time' => '11:00',
        'order' => 1,
    ]);

    $this->get("/{$vendor->username}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/show')
            ->has('events.0', fn (Assert $eventAssert) => $eventAssert
                ->where('title', 'Festival AI 2026')
                ->where('description', '<p>Deskripsi festival</p>')
                ->where('streaming_link', 'https://zoom.us/j/1234567890')
                ->where('online_platform', 'Zoom Meetings')
                ->has('tickets', 1)
                ->has('agendas', 1)
                ->has('speakers')
                ->has('sponsors')
                ->etc()
            )
        );
});

it('returns 404 for non-existent vendor', function () {
    $this->get('/nonexistent-user-xyz')
        ->assertNotFound();
});

it('returns 404 for a non-vendor user', function () {
    $user = User::factory()->create([
        'username' => 'adminuser',
        'role' => 'admin',
    ]);

    $this->get("/{$user->username}")
        ->assertNotFound();
});
