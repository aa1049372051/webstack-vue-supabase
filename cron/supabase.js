const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VUE_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 环境变量，请配置 SUPABASE_URL 和 SUPABASE_ANON_KEY（或对应的 VUE_APP_* 变量）')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function keepAlive() {
  const { error } = await supabase
    .from('category')
    .select('id')
    .limit(1)

  if (error) {
    throw error
  }

  console.log(`[${new Date().toISOString()}] Supabase keep-alive success`)
}

keepAlive().catch(error => {
  console.error(error.message || error)
  process.exit(1)
})
