export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    description?: string | null;
}

export type EventType = 'online' | 'offline' | 'hybrid';
export type EventStatus = 'draft' | 'published' | 'ended' | 'cancelled';
export type TicketTier = 'early_bird' | 'regular' | 'vip' | 'group_package' | 'custom';
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'media_partner' | 'community_partner';

export interface EventTicket {
    id?: number;
    name: string;
    type: 'free' | 'paid';
    tier: TicketTier;
    price: number;
    quantity: number;
    quantity_sold?: number;
    min_per_transaction?: number;
    max_per_transaction?: number;
    sale_start_date?: string | null;
    sale_end_date?: string | null;
    description?: string | null;
}

export interface EventAgenda {
    id?: number;
    title: string;
    description?: string | null;
    start_time: string;
    end_time: string;
    speaker_name?: string | null;
    stage_or_room?: string | null;
    order?: number;
}

export interface EventSpeaker {
    id?: number;
    name: string;
    role_or_title?: string | null;
    organization?: string | null;
    bio?: string | null;
    avatar?: string | null;
    social_links?: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        website?: string;
    } | null;
    order?: number;
}

export interface EventSponsor {
    id?: number;
    name: string;
    tier: SponsorTier;
    logo?: string | null;
    website_url?: string | null;
    order?: number;
}

export interface EventItem {
    id: number;
    user_id: number;
    category_id: number;
    category?: Category;
    title: string;
    slug: string;
    summary?: string | null;
    description?: string | null;
    banner_image?: string | null;
    event_type: EventType;
    status: EventStatus;
    start_date_time: string;
    end_date_time: string;
    timezone: string;

    // Online
    online_platform?: string | null;
    streaming_link?: string | null;
    streaming_instructions?: string | null;

    // Offline
    venue_name?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    google_maps_url?: string | null;

    // Relations
    tickets: EventTicket[];
    agendas?: EventAgenda[];
    speakers?: EventSpeaker[];
    sponsors?: EventSponsor[];
    coupons?: EventCoupon[];

    created_at?: string;
    updated_at?: string;
}

export interface EventCoupon {
    id: number;
    user_id: number;
    event_id?: number | null;
    event?: { id: number; title: string; slug: string } | null;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_amount: number;
    max_discount_amount?: number | null;
    min_purchase_amount: number;
    usage_limit?: number | null;
    usage_limit_per_user: number;
    used_count: number;
    valid_from?: string | null;
    valid_until?: string | null;
    is_active: boolean;
    created_at?: string;
}
