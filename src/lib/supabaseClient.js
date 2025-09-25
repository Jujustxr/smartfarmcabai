import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://torukaysucgikxnmphof.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnVrYXlzdWNnaWt4bm1waG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ3MjIsImV4cCI6MjA3NDMwMDcyMn0.SC85cW2NNJHfFq3qEnAou6acosYlZUbRByjigApFDBg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)