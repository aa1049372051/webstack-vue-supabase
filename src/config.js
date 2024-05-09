const config = {
    //process.env.VUE_APP_SUPABASE_KEY 可以在github仓库中设置变量，直接读取仓库配置以防暴露
    supabaseUrl: process.env.VUE_APP_SUPABASE_URL || 'https://aoupcgqekxzfhxsmejsn.supabase.co',
    supabaseKey: process.env.VUE_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXBjZ3Fla3h6Zmh4c21lanNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTA2NzM3NiwiZXhwIjoyMDMwNjQzMzc2fQ.WNmBtK1eHZFmOPACEDdKvsALIPBaNQ3r2AACqi1D3tg',
    supabaseBucketName: process.env.VUE_APP_BUCKET_NAME || 'webstack-vue',
}
export default config