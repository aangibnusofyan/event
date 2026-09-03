<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Vendor\VendorCouponController;
use App\Http\Controllers\Vendor\VendorEventController;
use App\Http\Controllers\VendorProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified', 'vendor'])->prefix('vendor')->name('vendor.')->group(function () {
    // Event Management CRUD
    Route::get('/events', [VendorEventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [VendorEventController::class, 'create'])->name('events.create');
    Route::post('/events', [VendorEventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [VendorEventController::class, 'show'])->name('events.show');
    Route::get('/events/{event}/edit', [VendorEventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [VendorEventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [VendorEventController::class, 'destroy'])->name('events.destroy');
    Route::post('/events/{event}/duplicate', [VendorEventController::class, 'duplicate'])->name('events.duplicate');
    Route::patch('/events/{event}/status', [VendorEventController::class, 'toggleStatus'])->name('events.status');

    // Promo Coupons CRUD
    Route::get('/coupons', [VendorCouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [VendorCouponController::class, 'store'])->name('coupons.store');
    Route::put('/coupons/{coupon}', [VendorCouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{coupon}', [VendorCouponController::class, 'destroy'])->name('coupons.destroy');
    Route::patch('/coupons/{coupon}/toggle', [VendorCouponController::class, 'toggle'])->name('coupons.toggle');
});

require __DIR__.'/settings.php';

Route::get('/{username}', [VendorProfileController::class, 'show'])->name('vendor.profile');
