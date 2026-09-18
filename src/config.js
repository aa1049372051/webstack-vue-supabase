const config = {
  supabaseUrl: process.env.VUE_APP_SUPABASE_URL || '',
  supabaseKey: process.env.VUE_APP_SUPABASE_ANON_KEY || '',
  supabaseBucketName: process.env.VUE_APP_BUCKET_NAME || 'webstack-vue',
}

if (process.env.NODE_ENV !== 'production') {
  if (!config.supabaseUrl) {
    // eslint-disable-next-line no-console
    console.warn('缺少 VUE_APP_SUPABASE_URL，请在 .env.local 中配置 Supabase 项目地址')
  }
  if (!config.supabaseKey) {
    // eslint-disable-next-line no-console
    console.warn('缺少 VUE_APP_SUPABASE_ANON_KEY，请使用 anon/publishable key，不要使用 service_role key')
  }
}

export default config
