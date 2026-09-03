<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Event;
use App\Models\EventCoupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorCouponController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $coupons = EventCoupon::where('user_id', $user->id)
            ->with('event:id,title,slug')
            ->latest()
            ->paginate(15);

        $events = Event::where('user_id', $user->id)
            ->orderBy('title')
            ->get(['id', 'title']);

        $stats = [
            'totalCoupons' => EventCoupon::where('user_id', $user->id)->count(),
            'activeCoupons' => EventCoupon::where('user_id', $user->id)->where('is_active', true)->count(),
            'totalUsed' => EventCoupon::where('user_id', $user->id)->sum('used_count'),
        ];

        return Inertia::render('vendor/coupons/index', [
            'coupons' => $coupons,
            'events' => $events,
            'stats' => $stats,
        ]);
    }

    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['code'] = strtoupper($data['code']);
        $data['user_id'] = $request->user()->id;

        EventCoupon::create($data);

        return redirect()->route('vendor.coupons.index')->with('success', 'Kupon promo berhasil dibuat!');
    }

    public function update(UpdateCouponRequest $request, EventCoupon $coupon): RedirectResponse
    {
        abort_if($coupon->user_id !== auth()->id(), 403);

        $data = $request->validated();
        $data['code'] = strtoupper($data['code']);

        $coupon->update($data);

        return redirect()->route('vendor.coupons.index')->with('success', 'Kupon promo berhasil diperbarui!');
    }

    public function destroy(EventCoupon $coupon): RedirectResponse
    {
        abort_if($coupon->user_id !== auth()->id(), 403);

        $coupon->delete();

        return redirect()->route('vendor.coupons.index')->with('success', 'Kupon promo berhasil dihapus!');
    }

    public function toggle(EventCoupon $coupon): RedirectResponse
    {
        abort_if($coupon->user_id !== auth()->id(), 403);

        $coupon->update(['is_active' => ! $coupon->is_active]);

        return back()->with('success', 'Status keaktifan kupon berhasil diubah.');
    }
}
