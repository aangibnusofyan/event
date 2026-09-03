<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\EventTicket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EventTicket>
 */
class EventTicketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'name' => 'Regular Pass',
            'type' => 'paid',
            'tier' => 'regular',
            'price' => 150000,
            'quantity' => 100,
            'quantity_sold' => 0,
            'min_per_transaction' => 1,
            'max_per_transaction' => 5,
            'sale_start_date' => now()->subDay(),
            'sale_end_date' => now()->addWeeks(2),
            'description' => 'Akses penuh ke seluruh sesi event.',
            'status' => 'active',
        ];
    }

    public function free(): static
    {
        return $this->state(fn () => [
            'name' => 'Free Admission',
            'type' => 'free',
            'price' => 0,
        ]);
    }

    public function earlyBird(): static
    {
        return $this->state(fn () => [
            'name' => 'Early Bird',
            'tier' => 'early_bird',
            'price' => 99000,
            'quantity' => 50,
        ]);
    }

    public function vip(): static
    {
        return $this->state(fn () => [
            'name' => 'VIP Access',
            'tier' => 'vip',
            'price' => 500000,
            'quantity' => 20,
        ]);
    }
}
