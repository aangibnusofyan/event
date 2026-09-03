<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $startDate = fake()->dateTimeBetween('+1 week', '+2 months');
        $endDate = (clone $startDate)->modify('+5 hours');

        return [
            'user_id' => User::factory()->vendor(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(5),
            'summary' => fake()->paragraph(1),
            'description' => fake()->paragraphs(3, true),
            'banner_image' => null,
            'event_type' => fake()->randomElement(['online', 'offline', 'hybrid']),
            'status' => 'published',
            'start_date_time' => $startDate,
            'end_date_time' => $endDate,
            'timezone' => 'Asia/Jakarta',
            'online_platform' => 'Zoom Meetings',
            'streaming_link' => 'https://zoom.us/j/1234567890?pwd=secretpassword',
            'streaming_instructions' => 'Harap bergabung 10 menit sebelum acara dimulai.',
            'venue_name' => fake()->company().' Ballroom',
            'address' => fake()->streetAddress(),
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'google_maps_url' => 'https://maps.google.com/?q=-6.2088,106.8456',
        ];
    }

    public function online(): static
    {
        return $this->state(fn () => [
            'event_type' => 'online',
            'venue_name' => null,
            'address' => null,
            'city' => null,
            'province' => null,
            'latitude' => null,
            'longitude' => null,
            'google_maps_url' => null,
        ]);
    }

    public function offline(): static
    {
        return $this->state(fn () => [
            'event_type' => 'offline',
            'online_platform' => null,
            'streaming_link' => null,
            'streaming_instructions' => null,
        ]);
    }

    public function hybrid(): static
    {
        return $this->state(fn () => [
            'event_type' => 'hybrid',
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
        ]);
    }
}
