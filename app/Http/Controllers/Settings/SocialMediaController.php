<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialMediaController extends Controller
{
    /**
     * Show the user's social media settings page.
     */
    public function edit(Request $request): Response
    {
        abort_if($request->user()->role !== 'vendor', 403);

        return Inertia::render('settings/social-media', [
            'socialLinks' => $request->user()->social_links ?? [],
        ]);
    }

    /**
     * Update the user's social media links.
     */
    public function update(Request $request): RedirectResponse
    {
        abort_if($request->user()->role !== 'vendor', 403);

        $validated = $request->validate([
            'instagram' => ['nullable', 'url', 'max:255'],
            'x' => ['nullable', 'url', 'max:255'],
            'tiktok' => ['nullable', 'url', 'max:255'],
            'youtube' => ['nullable', 'url', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
        ]);

        $request->user()->update([
            'social_links' => $validated,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Social media links updated.')]);

        return to_route('social-media.edit');
    }
}
