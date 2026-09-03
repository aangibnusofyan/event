<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

#[Fillable([
    'event_id',
    'name',
    'type',
    'tier',
    'price',
    'quantity',
    'quantity_sold',
    'min_per_transaction',
    'max_per_transaction',
    'sale_start_date',
    'sale_end_date',
    'description',
    'status',
])]
class EventTicket extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'quantity' => 'integer',
            'quantity_sold' => 'integer',
            'min_per_transaction' => 'integer',
            'max_per_transaction' => 'integer',
            'sale_start_date' => 'datetime',
            'sale_end_date' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Remaining quota available.
     */
    public function getRemainingQuantityAttribute(): int
    {
        return max(0, $this->quantity - $this->quantity_sold);
    }

    public function setSaleStartDateAttribute($value): void
    {
        $this->attributes['sale_start_date'] = ! empty($value) ? Carbon::parse($value)->toDateTimeString() : null;
    }

    public function setSaleEndDateAttribute($value): void
    {
        $this->attributes['sale_end_date'] = ! empty($value) ? Carbon::parse($value)->toDateTimeString() : null;
    }
}
