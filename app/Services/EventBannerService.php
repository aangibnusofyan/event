<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class EventBannerService
{
    /**
     * Process, crop to 16:9 (1280x720), compress, and store the uploaded banner image.
     */
    public function storeBanner(UploadedFile $file, int|string $userId): string
    {
        $manager = new ImageManager(new Driver);

        $image = $manager->decodePath($file->getRealPath());

        // Force crop/fit to 16:9 ratio (1280x720)
        $image->cover(1280, 720);

        // Compress to WebP with 80% quality for optimal sharpness and file size under 500KB
        $encoded = $image->encode(new WebpEncoder(quality: 80));

        $filename = Str::random(40).'.webp';
        $directory = "banners/vendor_{$userId}";
        $storagePath = "{$directory}/{$filename}";

        Storage::disk('public')->put($storagePath, (string) $encoded);

        return "/storage/{$storagePath}";
    }

    /**
     * Process, crop to 1:1 square (500x500), compress, and store speaker avatar.
     */
    public function storeSpeakerAvatar(UploadedFile $file, int|string $userId): string
    {
        $manager = new ImageManager(new Driver);

        $image = $manager->decodePath($file->getRealPath());

        // Crop to square 1:1 ratio (500x500)
        $image->cover(500, 500);

        // Compress to WebP with 80% quality
        $encoded = $image->encode(new WebpEncoder(quality: 80));

        $filename = Str::random(40).'.webp';
        $directory = "speakers/vendor_{$userId}";
        $storagePath = "{$directory}/{$filename}";

        Storage::disk('public')->put($storagePath, (string) $encoded);

        return "/storage/{$storagePath}";
    }

    /**
     * Process, proportionally resize (max width 800), compress, and store sponsor logo.
     */
    public function storeSponsorLogo(UploadedFile $file, int|string $userId): string
    {
        $manager = new ImageManager(new Driver);

        $image = $manager->decodePath($file->getRealPath());

        // Proportionally scale down with maximum width of 800px (preserve original aspect ratio)
        $image->scaleDown(width: 800);

        // Compress to WebP with 80% quality
        $encoded = $image->encode(new WebpEncoder(quality: 80));

        $filename = Str::random(40).'.webp';
        $directory = "sponsors/vendor_{$userId}";
        $storagePath = "{$directory}/{$filename}";

        Storage::disk('public')->put($storagePath, (string) $encoded);

        return "/storage/{$storagePath}";
    }

    /**
     * Delete an existing banner image from storage if it belongs to local public banners.
     */
    public function deleteBanner(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        $cleanPath = Str::startsWith($path, '/storage/')
            ? Str::after($path, '/storage/')
            : $path;

        if (Str::startsWith($cleanPath, 'banners/')) {
            return Storage::disk('public')->delete($cleanPath);
        }

        return false;
    }

    /**
     * Delete an existing speaker avatar from storage.
     */
    public function deleteSpeakerAvatar(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        $cleanPath = Str::startsWith($path, '/storage/')
            ? Str::after($path, '/storage/')
            : $path;

        if (Str::startsWith($cleanPath, 'speakers/')) {
            return Storage::disk('public')->delete($cleanPath);
        }

        return false;
    }

    /**
     * Delete an existing sponsor logo from storage.
     */
    public function deleteSponsorLogo(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        $cleanPath = Str::startsWith($path, '/storage/')
            ? Str::after($path, '/storage/')
            : $path;

        if (Str::startsWith($cleanPath, 'sponsors/')) {
            return Storage::disk('public')->delete($cleanPath);
        }

        return false;
    }
}
