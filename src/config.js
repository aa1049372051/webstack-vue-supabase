const config = {
    //process.env.SUPABASE_URL 可以在github仓库中设置变量，直接读取仓库配置以防暴露
    supabaseUrl: process.env.SUPABASE_URL || 'https://aoupcgqekxzfhxsmejsn.supabase.co',
    supabaseKey: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXBjZ3Fla3h6Zmh4c21lanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNjczNzYsImV4cCI6MjAzMDY0MzM3Nn0.PGJpDTnY0keFU4jP-dmirE9C8tP7Azy39_z9apu_3YE'
}
export default config