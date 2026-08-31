<?php

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
