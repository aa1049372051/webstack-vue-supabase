/**
 * 1.安装依赖
 * npm install @supabase/supabase-js
 * 2.更新自己的url和key
 * 3.node supabase.js
 * 4.添加定时任务每天跑一次
 * 
 */
// import { createClient } from '@supabase/supabase-js'

const createClient = require('@supabase/supabase-js').createClient;

// Create a single supabase client for interacting with your database
const url=''
const key=''
const supabase = createClient(url,key)

async function getData(){
  const { data,error } = await supabase
  .from('category')
  .select();
  console.log(data,error)
}

getData()