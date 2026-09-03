<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'event_id',
    'code',
    'discount_type',
    'discount_amount',
    'max_discount_amount',
    'min_purchase_amount',
    'usage_limit',
    'usage_limit_per_user',
    'used_count',
    'valid_from',
    'valid_until',
    'is_active',
])]
class EventCoupon extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_amount' => 'decimal:2',
            'max_discount_amount' => 'decimal:2',
            'min_purchase_amount' => 'decimal:2',
            'usage_limit' => 'integer',
            'usage_limit_per_user' => 'integer',
            'used_count' => 'integer',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Check if coupon is currently valid.
     */
    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        $now = now();

        if ($this->valid_from !== null && $now->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_until !== null && $now->gt($this->valid_until)) {
            return false;
        }

        return true;
    }
}
