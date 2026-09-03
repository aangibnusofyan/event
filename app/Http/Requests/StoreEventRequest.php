<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'vendor';
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'string'],
            'event_type' => ['required', 'in:online,offline,hybrid'],
            'status' => ['required', 'in:draft,published,ended,cancelled'],
            'start_date_time' => ['required', 'date'],
            'end_date_time' => ['required', 'date', 'after_or_equal:start_date_time'],
            'timezone' => ['nullable', 'string', 'max:50'],

            // Online attributes
            'online_platform' => ['nullable', 'string', 'max:100'],
            'streaming_link' => ['nullable', 'string', 'max:1000'],
            'streaming_instructions' => ['nullable', 'string'],

            // Offline attributes
            'venue_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'google_maps_url' => ['nullable', 'string', 'max:1000'],

            // Tickets
            'tickets' => ['required', 'array', 'min:1'],
            'tickets.*.name' => ['required', 'string', 'max:255'],
            'tickets.*.type' => ['required', 'in:free,paid'],
            'tickets.*.tier' => ['required', 'in:early_bird,regular,vip,group_package,custom'],
            'tickets.*.price' => ['nullable', 'numeric', 'min:0'],
            'tickets.*.quantity' => ['required', 'integer', 'min:1'],
            'tickets.*.min_per_transaction' => ['nullable', 'integer', 'min:1'],
            'tickets.*.max_per_transaction' => ['nullable', 'integer', 'min:1'],
            'tickets.*.sale_start_date' => ['nullable', 'date'],
            'tickets.*.sale_end_date' => ['nullable', 'date'],
            'tickets.*.description' => ['nullable', 'string'],

            // Agendas
            'agendas' => ['nullable', 'array'],
            'agendas.*.title' => ['required_with:agendas', 'string', 'max:255'],
            'agendas.*.start_time' => ['required_with:agendas', 'string'],
            'agendas.*.end_time' => ['required_with:agendas', 'string'],
            'agendas.*.speaker_name' => ['nullable', 'string', 'max:255'],
            'agendas.*.stage_or_room' => ['nullable', 'string', 'max:255'],
            'agendas.*.description' => ['nullable', 'string'],

            // Speakers
            'speakers' => ['nullable', 'array'],
            'speakers.*.name' => ['required_with:speakers', 'string', 'max:255'],
            'speakers.*.role_or_title' => ['nullable', 'string', 'max:255'],
            'speakers.*.organization' => ['nullable', 'string', 'max:255'],
            'speakers.*.bio' => ['nullable', 'string'],
            'speakers.*.avatar' => ['nullable', 'string'],
            'speakers.*.social_links' => ['nullable', 'array'],

            // Sponsors
            'sponsors' => ['nullable', 'array'],
            'sponsors.*.name' => ['required_with:sponsors', 'string', 'max:255'],
            'sponsors.*.tier' => ['required_with:sponsors', 'in:platinum,gold,silver,bronze,media_partner,community_partner'],
            'sponsors.*.logo' => ['nullable', 'string'],
            'sponsors.*.website_url' => ['nullable', 'string', 'max:500'],
        ];
    }
}
