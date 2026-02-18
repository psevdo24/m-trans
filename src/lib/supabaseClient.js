import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

try {
    if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl.startsWith('http')) {
        console.warn('Supabase keys are missing or invalid.')
        // Mock client for UI testing without backend
        const mockBuilder = {
            select: () => ({
                order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured. Check .env.local' } }),
            }),
            insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            update: () => ({
                eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            }),
            delete: () => ({
                eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            }),
        }
        supabase = {
            from: () => mockBuilder,
        }
    } else {
        supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
} catch (error) {
    console.error('Supabase client creation failed:', error)
    supabase = {
        from: () => ({
            select: () => ({
                order: () => Promise.resolve({ data: [], error: { message: error.message } }),
            }),
            update: () => ({
                eq: () => Promise.resolve({ error: { message: error.message } }),
            }),
        }),
    }
}

export { supabase }
