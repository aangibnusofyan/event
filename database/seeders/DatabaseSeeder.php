<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\EventAgenda;
use App\Models\EventCoupon;
use App\Models\EventSpeaker;
use App\Models\EventSponsor;
use App\Models\EventTicket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Musik', 'slug' => 'musik', 'icon' => 'music', 'description' => 'Konser musik, festival, dan penampilan live.'],
            ['name' => 'Teknologi & Startup', 'slug' => 'teknologi-startup', 'icon' => 'cpu', 'description' => 'Konferensi teknologi, hackathon, dan temu startup.'],
            ['name' => 'Bisnis & Karir', 'slug' => 'bisnis-karir', 'icon' => 'briefcase', 'description' => 'Seminar bisnis, networking, dan pameran karir.'],
            ['name' => 'Workshop & Edukasi', 'slug' => 'workshop-edukasi', 'icon' => 'book-open', 'description' => 'Pelatihan keahlian, kelas intensif, dan bootcamp.'],
            ['name' => 'Festival & Hiburan', 'slug' => 'festival-hiburan', 'icon' => 'sparkles', 'description' => 'Pesta rakyat, karnaval budaya, dan pameran interaktif.'],
            ['name' => 'Olahraga & Kebugaran', 'slug' => 'olahraga-kebugaran', 'icon' => 'trophy', 'description' => 'Maraton, turnamen olahraga, dan yoga gathering.'],
            ['name' => 'Seni & Budaya', 'slug' => 'seni-budaya', 'icon' => 'palette', 'description' => 'Pameran seni rupa, teater, tari, dan warisan budaya.'],
            ['name' => 'Kuliner', 'slug' => 'kuliner', 'icon' => 'utensils', 'description' => 'Food festival, kelas memasak, dan demo chef ternama.'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // Default Vendor User
        $vendor = User::updateOrCreate(
            ['email' => 'vendor@example.com'],
            [
                'name' => 'SpotEvent Official Event Organizer',
                'username' => 'spotevent',
                'role' => 'vendor',
                'password' => Hash::make('password'),
                'about' => 'Penyelenggara festival, konferensi teknologi, dan pameran terkemuka di Indonesia.',
                'email_verified_at' => now(),
            ]
        );

        // Regular/Admin User
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'username' => 'testuser',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $techCat = Category::where('slug', 'teknologi-startup')->first();
        $musicCat = Category::where('slug', 'musik')->first();
        $workshopCat = Category::where('slug', 'workshop-edukasi')->first();

        // Sample Event 1: Hybrid Tech Summit
        $event1 = Event::updateOrCreate(
            ['slug' => 'indonesia-tech-summit-2026'],
            [
                'user_id' => $vendor->id,
                'category_id' => $techCat?->id ?? 1,
                'title' => 'Indonesia Tech Summit 2026',
                'summary' => 'Konferensi teknologi terbesar di Indonesia menghadirkan inovasi AI, Web3, and Cloud computing.',
                'description' => 'Indonesia Tech Summit 2026 adalah pertemuan tahunan para pengembang, pendiri startup, investor, dan eksekutif teknologi. Bergabunglah secara langsung di ICE BSD atau ikuti live stream interaktif dari mana saja.',
                'event_type' => 'hybrid',
                'status' => 'published',
                'start_date_time' => now()->addDays(20)->setTime(9, 0),
                'end_date_time' => now()->addDays(20)->setTime(17, 0),
                'timezone' => 'Asia/Jakarta',
                'online_platform' => 'Zoom Webinar',
                'streaming_link' => 'https://zoom.us/j/9876543210?pwd=techsummitpass',
                'streaming_instructions' => 'Gunakan nama lengkap sesuai tiket saat masuk ke Zoom.',
                'venue_name' => 'Indonesia Convention Exhibition (ICE) BSD',
                'address' => 'Jl. BSD Grand Boulevard No.1, Pagedangan, Tangerang, Banten',
                'city' => 'Tangerang',
                'province' => 'Banten',
                'latitude' => -6.3015,
                'longitude' => 106.6378,
                'google_maps_url' => 'https://maps.google.com/?q=ICE+BSD',
            ]
        );

        // Tickets for Event 1
        EventTicket::updateOrCreate(
            ['event_id' => $event1->id, 'name' => 'Early Bird Virtual Pass'],
            [
                'type' => 'paid',
                'tier' => 'early_bird',
                'price' => 150000,
                'quantity' => 200,
                'quantity_sold' => 45,
                'sale_start_date' => now()->subDays(5),
                'sale_end_date' => now()->addDays(10),
                'description' => 'Akses streaming online interaktif dan reksaman materi.',
            ]
        );

        EventTicket::updateOrCreate(
            ['event_id' => $event1->id, 'name' => 'VIP Onsite Pass'],
            [
                'type' => 'paid',
                'tier' => 'vip',
                'price' => 750000,
                'quantity' => 50,
                'quantity_sold' => 12,
                'sale_start_date' => now()->subDays(5),
                'sale_end_date' => now()->addDays(18),
                'description' => 'Akses onsite, coffee break, lunch banquet, exclusive VIP networking lounge.',
            ]
        );

        // Agendas for Event 1
        EventAgenda::updateOrCreate(
            ['event_id' => $event1->id, 'title' => 'Registrasi & Networking Morning'],
            [
                'start_time' => '08:30',
                'end_time' => '09:30',
                'stage_or_room' => 'Main Lobby & Foyer',
                'order' => 1,
            ]
        );
        EventAgenda::updateOrCreate(
            ['event_id' => $event1->id, 'title' => 'Keynote: The Future of AI in Southeast Asia'],
            [
                'start_time' => '09:30',
                'end_time' => '11:00',
                'speaker_name' => 'Dr. Arif Pratama',
                'stage_or_room' => 'Plenary Hall',
                'order' => 2,
            ]
        );

        // Speakers for Event 1
        EventSpeaker::updateOrCreate(
            ['event_id' => $event1->id, 'name' => 'Dr. Arif Pratama'],
            [
                'role_or_title' => 'Head of AI Research',
                'organization' => 'Nusantara AI Lab',
                'bio' => 'Praktisi dan peneliti machine learning dengan pengalaman lebih dari 12 tahun di Silicon Valley dan Asia Tenggara.',
                'order' => 1,
            ]
        );

        // Sponsors for Event 1
        EventSponsor::updateOrCreate(
            ['event_id' => $event1->id, 'name' => 'CloudScale Technologies'],
            [
                'tier' => 'platinum',
                'website_url' => 'https://example.com',
                'order' => 1,
            ]
        );

        // Coupon for Vendor
        EventCoupon::updateOrCreate(
            ['user_id' => $vendor->id, 'code' => 'TECHSUMMIT20'],
            [
                'event_id' => $event1->id,
                'discount_type' => 'percentage',
                'discount_amount' => 20,
                'max_discount_amount' => 100000,
                'min_purchase_amount' => 150000,
                'usage_limit' => 100,
                'valid_from' => now()->subDay(),
                'valid_until' => now()->addMonth(),
                'is_active' => true,
            ]
        );
    }
}
