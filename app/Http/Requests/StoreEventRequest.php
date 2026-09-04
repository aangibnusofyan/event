<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

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
            'banner_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:10240'],
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
            'speakers.*.avatar' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value instanceof UploadedFile) {
                        $validator = Validator::make(
                            ['file' => $value],
                            ['file' => ['image', 'mimes:jpeg,png,webp', 'max:10240']],
                            [
                                'file.image' => 'Foto avatar pembicara harus berupa gambar.',
                                'file.mimes' => 'Format foto avatar harus berupa JPG, PNG, atau WEBP.',
                                'file.max' => 'Ukuran foto avatar terlalu besar. Maksimal 10MB.',
                            ]
                        );
                        if ($validator->fails()) {
                            $fail($validator->errors()->first('file'));
                        }
                    } elseif (! is_string($value)) {
                        $fail('Foto avatar tidak valid.');
                    }
                },
            ],
            'speakers.*.social_links' => ['nullable', 'array'],

            // Sponsors
            'sponsors' => ['nullable', 'array'],
            'sponsors.*.name' => ['required_with:sponsors', 'string', 'max:255'],
            'sponsors.*.tier' => ['required_with:sponsors', 'in:platinum,gold,silver,bronze,media_partner,community_partner'],
            'sponsors.*.logo' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value instanceof UploadedFile) {
                        $validator = Validator::make(
                            ['file' => $value],
                            ['file' => ['image', 'mimes:jpeg,png,webp', 'max:10240']],
                            [
                                'file.image' => 'Logo sponsor harus berupa gambar.',
                                'file.mimes' => 'Format logo sponsor harus berupa JPG, PNG, atau WEBP.',
                                'file.max' => 'Ukuran logo sponsor terlalu besar. Maksimal 10MB.',
                            ]
                        );
                        if ($validator->fails()) {
                            $fail($validator->errors()->first('file'));
                        }
                    } elseif (! is_string($value)) {
                        $fail('Logo sponsor tidak valid.');
                    }
                },
            ],
            'sponsors.*.website_url' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'banner_image.image' => 'File banner harus berupa gambar.',
            'banner_image.mimes' => 'Format gambar harus berupa JPG, PNG, atau WEBP.',
            'banner_image.max' => 'Ukuran foto terlalu besar. Maksimal 10MB.',
            'speakers.*.avatar.image' => 'Foto avatar pembicara harus berupa gambar.',
            'speakers.*.avatar.mimes' => 'Format foto avatar harus berupa JPG, PNG, atau WEBP.',
            'speakers.*.avatar.max' => 'Ukuran foto avatar terlalu besar. Maksimal 10MB.',
            'sponsors.*.logo.image' => 'Logo sponsor harus berupa gambar.',
            'sponsors.*.logo.mimes' => 'Format logo sponsor harus berupa JPG, PNG, atau WEBP.',
            'sponsors.*.logo.max' => 'Ukuran logo sponsor terlalu besar. Maksimal 10MB.',
        ];
    }
}
