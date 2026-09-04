<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'user_id',
    'category_id',
    'title',
    'slug',
    'summary',
    'description',
    'banner_image',
    'event_type',
    'status',
    'start_date_time',
    'end_date_time',
    'timezone',
    'online_platform',
    'streaming_link',
    'streaming_instructions',
    'venue_name',
    'address',
    'city',
    'province',
    'latitude',
    'longitude',
    'google_maps_url',
])]
class Event extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date_time' => 'datetime',
            'end_date_time' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function bannerImage(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): ?string {
                if (! $value) {
                    return null;
                }

                if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
                    return $value;
                }

                return Storage::disk('public')->url($value);
            }
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<EventAgenda, $this>
     */
    public function agendas(): HasMany
    {
        return $this->hasMany(EventAgenda::class)->orderBy('order')->orderBy('start_time');
    }

    /**
     * @return HasMany<EventSpeaker, $this>
     */
    public function speakers(): HasMany
    {
        return $this->hasMany(EventSpeaker::class)->orderBy('order');
    }

    /**
     * @return HasMany<EventSponsor, $this>
     */
    public function sponsors(): HasMany
    {
        return $this->hasMany(EventSponsor::class)->orderBy('order');
    }

    /**
     * @return HasMany<EventTicket, $this>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(EventTicket::class);
    }

    /**
     * @return HasMany<EventCoupon, $this>
     */
    public function coupons(): HasMany
    {
        return $this->hasMany(EventCoupon::class);
    }

    /**
     * Scope for published events.
     *
     * @param  Builder<Event>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /**
     * Scope for upcoming events.
     *
     * @param  Builder<Event>  $query
     */
    public function scopeUpcoming(Builder $query): void
    {
        $query->where('end_date_time', '>=', now());
    }

    /**
     * Accessor for lowest ticket price formatted.
     */
    public function getStartingPriceAttribute(): string
    {
        $minPrice = $this->tickets->min('price');

        if ($minPrice === null || $minPrice == 0) {
            return 'Gratis';
        }

        return 'Rp '.number_format($minPrice, 0, ',', '.');
    }
}
