CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    membership_type VARCHAR(20) DEFAULT 'standard' CHECK (membership_type IN ('standard', 'vip', 'premium')),
    points INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_membership_type ON public.users(membership_type);

CREATE TABLE IF NOT EXISTS public.courts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    surface VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    price_day INTEGER NOT NULL,
    price_night INTEGER NOT NULL,
    price_weekend INTEGER NOT NULL,
    features TEXT[] DEFAULT '{}',
    equipment_included TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.courts (name, type, surface, capacity, price_day, price_night, price_weekend, features, equipment_included) VALUES
('Cancha 1', 'Fútbol 6', 'Sintético', 14, 24000, 26000, 29000, 
 ARRAY['Galería desde un Arco', 'Cerca de estacionamientos'], 
 ARRAY['Pelota', 'Petos']),
('Cancha 2', 'Fútbol 6', 'Sintético', 14, 24000, 26000, 29000, 
 ARRAY['Galería desde un costado', 'Más alejada de los estacionamientos'], 
 ARRAY['Pelota', 'Petos']);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_price INTEGER NOT NULL,
    discount_applied INTEGER DEFAULT 0,
    discount_code VARCHAR(50),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_booking_slot UNIQUE (court_id, booking_date, start_time)
);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_court_id ON public.bookings(court_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    captain_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT,
    logo_url TEXT,
    members_count INTEGER DEFAULT 1,
    ranking_points INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_teams_captain_id ON public.teams(captain_id);
CREATE INDEX idx_teams_ranking_points ON public.teams(ranking_points DESC);
CREATE INDEX idx_teams_active ON public.teams(active);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('captain', 'member')),
    position VARCHAR(50),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_team_member UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    max_teams INTEGER NOT NULL,
    registration_fee INTEGER NOT NULL,
    prize_pool TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'registration_open', 'in_progress', 'completed', 'cancelled')),
    rules TEXT[] DEFAULT '{}',
    organizer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_category ON public.tournaments(category);
CREATE INDEX idx_tournaments_dates ON public.tournaments(start_date, end_date);

CREATE TABLE IF NOT EXISTS public.tournament_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'withdrawn')),
    CONSTRAINT unique_tournament_team UNIQUE (tournament_id, team_id)
);

CREATE INDEX idx_tournament_registrations_tournament_id ON public.tournament_registrations(tournament_id);
CREATE INDEX idx_tournament_registrations_team_id ON public.tournament_registrations(team_id);

CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('seeking_team', 'seeking_players')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    game_date DATE NOT NULL,
    game_time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    players_needed INTEGER,
    position_seeking VARCHAR(50),
    contact_info VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_community_posts_author_id ON public.community_posts(author_id);
CREATE INDEX idx_community_posts_type ON public.community_posts(type);
CREATE INDEX idx_community_posts_status ON public.community_posts(status);
CREATE INDEX idx_community_posts_game_date ON public.community_posts(game_date);

CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value INTEGER NOT NULL,
    min_amount INTEGER,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE,
    day_restrictions TEXT[],
    time_restrictions JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO public.discount_codes (code, description, discount_type, discount_value, valid_from, day_restrictions, time_restrictions) VALUES
('PRIMERPLAY', '15% descuento primera reserva', 'percentage', 15, CURRENT_DATE, NULL, NULL),
('LUNESDEGOLES', '25% descuento lunes', 'percentage', 25, CURRENT_DATE, ARRAY['monday'], '{"start": "20:00", "end": "22:00"}'),
('MARTESDEBOLEA', '20% descuento martes', 'percentage', 20, CURRENT_DATE, ARRAY['tuesday'], '{"start": "20:00", "end": "22:00"}'),
('MIERCOLESFEMENINO', '25% descuento miércoles damas', 'percentage', 25, CURRENT_DATE, ARRAY['wednesday'], '{"start": "20:00", "end": "23:00"}');

CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_active ON public.discount_codes(active);

CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed')),
    related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX idx_user_points_type ON public.user_points(type);

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    reward_points INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Courts are viewable by everyone" ON public.courts FOR SELECT USING (true);
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);
CREATE POLICY "Team captains can update their teams" ON public.teams FOR UPDATE USING (auth.uid() = captain_id);
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users can join teams" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Discount codes are viewable by authenticated users" ON public.discount_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view their own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE OR REPLACE VIEW team_rankings AS
SELECT 
    t.*,
    CASE 
        WHEN (t.wins + t.losses + t.draws) = 0 THEN 0
        ELSE ROUND((t.wins::decimal / (t.wins + t.losses + t.draws)) * 100, 2)
    END as win_percentage,
    CASE 
        WHEN t.goals_against = 0 THEN t.goals_for
        ELSE ROUND(t.goals_for::decimal / t.goals_against, 2)
    END as goal_difference_ratio,
    u.name as captain_name
FROM public.teams t
JOIN public.users u ON t.captain_id = u.id
WHERE t.active = true
ORDER BY t.ranking_points DESC, win_percentage DESC;

CREATE OR REPLACE VIEW court_availability AS
SELECT 
    c.id,
    c.name,
    c.type,
    COUNT(b.id) as total_bookings_today,
    ARRAY_AGG(b.start_time ORDER BY b.start_time) FILTER (WHERE b.booking_date = CURRENT_DATE AND b.status IN ('confirmed', 'pending')) as booked_slots_today
FROM public.courts c
LEFT JOIN public.bookings b ON c.id = b.court_id 
    AND b.booking_date = CURRENT_DATE 
    AND b.status IN ('confirmed', 'pending')
WHERE c.active = true
GROUP BY c.id, c.name, c.type;
