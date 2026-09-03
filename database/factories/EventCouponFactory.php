<?php

namespace Database\Factories;

use App\Models\EventCoupon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<EventCoupon>
 */
class EventCouponFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->vendor(),
            'event_id' => null,
            'code' => strtoupper(Str::random(8)),
            'discount_type' => 'percentage',
            'discount_amount' => 20,
            'max_discount_amount' => 50000,
            'min_purchase_amount' => 100000,
            'usage_limit' => 100,
            'usage_limit_per_user' => 1,
            'used_count' => 0,
            'valid_from' => now()->subDay(),
            'valid_until' => now()->addMonth(),
            'is_active' => true,
        ];
    }

    public function fixed(): static
    {
        return $this->state(fn () => [
            'discount_type' => 'fixed',
            'discount_amount' => 50000,
            'max_discount_amount' => null,
        ]);
    }
}
