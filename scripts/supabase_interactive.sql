-- ============================================
-- FlexPro v2 Interactive Features Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Step 1: Messages Table (Real-time Chat)
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(
    LEAST(sender_id, receiver_id),
    GREATEST(sender_id, receiver_id),
    created_at DESC
);

-- ============================================
-- Step 2: Diet Templates Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.diet_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    diet_data JSONB NOT NULL, -- Stores the diet plan structure
    diet_rest_data JSONB, -- Stores rest day diet if different
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for diet templates
CREATE INDEX IF NOT EXISTS idx_diet_templates_coach ON public.diet_templates(coach_id);
CREATE INDEX IF NOT EXISTS idx_diet_templates_public ON public.diet_templates(is_public) WHERE is_public = TRUE;

-- ============================================
-- Step 3: Workout Logs Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps_performed INTEGER,
    weight_used DECIMAL(8,2),
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Ensure one log per user/exercise/set per day
    UNIQUE(user_id, workout_date, exercise_name, set_number)
);

-- Indexes for workout logs
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON public.workout_logs(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise ON public.workout_logs(exercise_name);
CREATE INDEX IF NOT EXISTS idx_workout_logs_completed ON public.workout_logs(completed);

-- ============================================
-- Step 4: Progress Photos Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_date DATE NOT NULL,
    pose_type TEXT CHECK (pose_type IN ('front', 'back', 'side', 'other')),
    weight DECIMAL(6,2),
    height DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    notes TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for progress photos
CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON public.progress_photos(user_id, photo_date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_date ON public.progress_photos(photo_date);

-- ============================================
-- Storage Bucket Setup
-- ============================================

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS Policies
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Messages RLS Policies
-- ============================================

-- Users can read messages where they are sender or receiver
CREATE POLICY "Users can read their own messages" ON public.messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

-- Users can insert messages they send
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
    );

-- Users can update messages they sent (for marking as read, etc.)
CREATE POLICY "Users can update their sent messages" ON public.messages
    FOR UPDATE USING (
        auth.uid() = sender_id
    );

-- ============================================
-- Diet Templates RLS Policies
-- ============================================

-- Coaches can read their own templates and public ones
CREATE POLICY "Coaches can read diet templates" ON public.diet_templates
    FOR SELECT USING (
        auth.uid() = coach_id OR is_public = TRUE
    );

-- Coaches can manage their own templates
CREATE POLICY "Coaches can manage their diet templates" ON public.diet_templates
    FOR ALL USING (
        auth.uid() = coach_id
    );

-- ============================================
-- Workout Logs RLS Policies
-- ============================================

-- Users can manage their own workout logs
CREATE POLICY "Users can manage their workout logs" ON public.workout_logs
    FOR ALL USING (
        auth.uid() = user_id
    );

-- Coaches can read their clients' workout logs
CREATE POLICY "Coaches can read client workout logs" ON public.workout_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients
            WHERE clients.id::text = workout_logs.user_id::text
            AND clients.coach_id = auth.uid()
        )
    );

-- ============================================
-- Progress Photos RLS Policies
-- ============================================

-- Users can manage their own photos
CREATE POLICY "Users can manage their progress photos" ON public.progress_photos
    FOR ALL USING (
        auth.uid() = user_id
    );

-- Coaches can read their clients' photos (unless marked private)
CREATE POLICY "Coaches can read client progress photos" ON public.progress_photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients
            WHERE clients.id::text = progress_photos.user_id::text
            AND clients.coach_id = auth.uid()
        ) AND (is_private = FALSE OR auth.uid() = user_id)
    );

-- ============================================
-- Storage RLS Policies
-- ============================================

-- Progress photos storage policies
CREATE POLICY "Users can upload their progress photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their progress photos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'progress-photos' AND (
            auth.uid()::text = (storage.foldername(name))[1] OR
            EXISTS (
                SELECT 1 FROM public.clients
                WHERE clients.id::text = (storage.foldername(name))[1]
                AND clients.coach_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update their progress photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their progress photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- Updated At Triggers
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables
CREATE TRIGGER handle_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_diet_templates_updated_at
    BEFORE UPDATE ON public.diet_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_workout_logs_updated_at
    BEFORE UPDATE ON public.workout_logs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_progress_photos_updated_at
    BEFORE UPDATE ON public.progress_photos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Helper Functions
-- ============================================

-- Function to get unread message count
CREATE OR REPLACE FUNCTION public.get_unread_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.messages
        WHERE receiver_id = user_uuid
        AND is_read = FALSE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(sender_uuid UUID, receiver_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.messages
    SET is_read = TRUE, updated_at = NOW()
    WHERE sender_id = sender_uuid
    AND receiver_id = receiver_uuid
    AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;