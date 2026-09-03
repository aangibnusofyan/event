<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        $coupon = $this->route('coupon');

        return $this->user() && $this->user()->role === 'vendor' && $coupon && $coupon->user_id === $this->user()->id;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $coupon = $this->route('coupon');

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('event_coupons')
                    ->where(fn ($query) => $query->where('user_id', $this->user()->id))
                    ->ignore($coupon?->id),
            ],
            'event_id' => [
                'nullable',
                Rule::exists('events', 'id')->where(fn ($query) => $query->where('user_id', $this->user()->id)),
            ],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_amount' => ['required', 'numeric', 'min:1'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'min_purchase_amount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
        ];
    }
}
