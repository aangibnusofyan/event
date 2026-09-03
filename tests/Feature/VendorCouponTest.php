<?php

use App\Models\EventCoupon;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->vendor = User::factory()->vendor()->create();
});

it('allows vendor to view coupons page', function () {
    EventCoupon::factory()->create([
        'user_id' => $this->vendor->id,
        'code' => 'DISKON10',
    ]);

    $this->actingAs($this->vendor)
        ->get('/vendor/coupons')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/coupons/index')
            ->has('coupons.data', 1)
            ->where('coupons.data.0.code', 'DISKON10')
            ->has('stats')
        );
});

it('allows vendor to create a percentage discount coupon', function () {
    $payload = [
        'code' => 'PROMO50',
        'discount_type' => 'percentage',
        'discount_amount' => 50,
        'max_discount_amount' => 100000,
        'min_purchase_amount' => 150000,
        'usage_limit' => 50,
        'usage_limit_per_user' => 1,
        'is_active' => true,
    ];

    $this->actingAs($this->vendor)
        ->post('/vendor/coupons', $payload)
        ->assertRedirect('/vendor/coupons');

    $this->assertDatabaseHas('event_coupons', [
        'user_id' => $this->vendor->id,
        'code' => 'PROMO50',
        'discount_type' => 'percentage',
        'discount_amount' => 50,
        'usage_limit' => 50,
    ]);
});

it('allows vendor to create a fixed cut discount coupon', function () {
    $payload = [
        'code' => 'POTONGAN25K',
        'discount_type' => 'fixed',
        'discount_amount' => 25000,
        'min_purchase_amount' => 50000,
        'usage_limit' => 100,
        'usage_limit_per_user' => 1,
        'is_active' => true,
    ];

    $this->actingAs($this->vendor)
        ->post('/vendor/coupons', $payload)
        ->assertRedirect('/vendor/coupons');

    $this->assertDatabaseHas('event_coupons', [
        'user_id' => $this->vendor->id,
        'code' => 'POTONGAN25K',
        'discount_type' => 'fixed',
        'discount_amount' => 25000,
    ]);
});

it('allows vendor to update a coupon', function () {
    $coupon = EventCoupon::factory()->create([
        'user_id' => $this->vendor->id,
        'code' => 'SEBELUMNYA',
        'discount_amount' => 10,
    ]);

    $payload = [
        'code' => 'SESUDAHNYA',
        'discount_type' => 'percentage',
        'discount_amount' => 30,
        'is_active' => true,
    ];

    $this->actingAs($this->vendor)
        ->put("/vendor/coupons/{$coupon->id}", $payload)
        ->assertRedirect('/vendor/coupons');

    $this->assertDatabaseHas('event_coupons', [
        'id' => $coupon->id,
        'code' => 'SESUDAHNYA',
        'discount_amount' => 30,
    ]);
});

it('allows vendor to toggle active status of a coupon', function () {
    $coupon = EventCoupon::factory()->create([
        'user_id' => $this->vendor->id,
        'is_active' => true,
    ]);

    $this->actingAs($this->vendor)
        ->patch("/vendor/coupons/{$coupon->id}/toggle")
        ->assertRedirect();

    expect($coupon->fresh()->is_active)->toBeFalse();
});

it('allows vendor to delete a coupon', function () {
    $coupon = EventCoupon::factory()->create([
        'user_id' => $this->vendor->id,
    ]);

    $this->actingAs($this->vendor)
        ->delete("/vendor/coupons/{$coupon->id}")
        ->assertRedirect('/vendor/coupons');

    $this->assertDatabaseMissing('event_coupons', [
        'id' => $coupon->id,
    ]);
});

it('prevents vendor from modifying another vendors coupon', function () {
    $otherVendor = User::factory()->vendor()->create();
    $coupon = EventCoupon::factory()->create([
        'user_id' => $otherVendor->id,
        'code' => 'OTHER50',
    ]);

    $this->actingAs($this->vendor)
        ->put("/vendor/coupons/{$coupon->id}", [
            'code' => 'HACKED',
            'discount_type' => 'percentage',
            'discount_amount' => 90,
            'is_active' => true,
        ])
        ->assertForbidden();
});
