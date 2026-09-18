import { createClient } from '@supabase/supabase-js'
import config from '@/config.js'
import md5 from 'js-md5'

const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

function throwIfError(error) {
  if (error) {
    throw error
  }
}

function toSortValue(value) {
  const sort = Number(value)
  return Number.isFinite(sort) && sort > 0 ? sort : 10000
}

function sortBySortAndId(a, b) {
  const sortA = toSortValue(a && a.sort)
  const sortB = toSortValue(b && b.sort)
  if (sortA !== sortB) return sortA - sortB
  return Number(a && a.id || 0) - Number(b && b.id || 0)
}

function sortMainList(list = []) {
  return list.sort(sortBySortAndId).map(item => {
    if (Array.isArray(item.site)) {
      item.site.sort(sortBySortAndId)
    }
    if (Array.isArray(item.children)) {
      item.children.sort(sortBySortAndId).forEach(child => {
        if (Array.isArray(child.site)) {
          child.site.sort(sortBySortAndId)
        }
      })
    }
    return item
  })
}

function getFileExt(file) {
  const nameExt = file.name && file.name.indexOf('.') > -1 ? file.name.split('.').pop() : ''
  if (nameExt) return nameExt.toLowerCase()
  const typeExtMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  return typeExtMap[file.type] || 'png'
}

export default supabase

// 获取首页数据
export async function getMainList() {
  const { data, error } = await supabase
    .from('category')
    .select(
      `*,site(
  id,title,url,logo,description,logotype,sort
),children(*,site(
  id,title,url,logo,description,logotype,sort
))`
    )
    .order('sort', { ascending: true })
    .order('id', { ascending: true })
    .eq('parent_id', 0)
  throwIfError(error)
  return sortMainList(data || [])
}

export async function getCategoryList(params = {}) {
  let query = supabase
    .from('category')
    .select(
      `*,father(name),site(*),children(*)`,
    )
    .order('sort', { ascending: true })
    .order('id', { ascending: true })

  if (params.name) {
    query = query.ilike('name', `%${params.name}%`)
  }

  const { data, error } = await query
  throwIfError(error)
  return data || []
}

export async function getFirstCategoryList() {
  const { data, error } = await supabase
    .from('category')
    .select(
      `*,father(name),site(*),children(*)`,
    )
    .eq('parent_id', 0)
    .order('sort', { ascending: true })
    .order('id', { ascending: true })
  throwIfError(error)
  return (data || []).map(item => {
    if (Array.isArray(item.children)) {
      item.children.sort(sortBySortAndId)
    }
    return item
  })
}

// 添加分类
export async function addCategory(item, pid = 0) {
  const { data, error } = await supabase
    .from('category')
    .insert({
      name: item.name,
      en_name: item.en_name,
      icon: item.icon,
      sort: toSortValue(item.sort),
      parent_id: pid || 0,
    })
    .select()
  throwIfError(error)
  return data || []
}

// 更新分类
export async function updateCategory(id, value) {
  const payload = {
    id,
    name: value.name,
    en_name: value.en_name,
    icon: value.icon,
    sort: toSortValue(value.sort),
    parent_id: value.parent_id || 0,
  }
  const { data, error } = await supabase
    .from('category')
    .upsert(payload)
    .eq('id', id)
    .select()
  throwIfError(error)
  return data || []
}

// 删除分类
export async function delCategory(ids) {
  const { error } = await supabase
    .from('category')
    .delete()
    .in('id', ids)
  throwIfError(error)
}

export async function getSiteList(params = {}) {
  let query = supabase
    .from('site')
    .select(
      `*,category(*,father(*))`
    )
    .order('sort', { ascending: true })
    .order('id', { ascending: true })

  if (params.title) {
    query = query.ilike('title', `%${params.title}%`)
  }

  const { data, error } = await query
  throwIfError(error)
  return data || []
}

// 插入网站
export async function addSite(item, pid) {
  const { data, error } = await supabase.from('site').insert({
    url: item.url,
    logo: item.logo,
    title: item.title,
    description: item.description,
    sort: toSortValue(item.sort),
    logotype: item.logotype || 1,
    is_used: item.is_used,
    category_id: pid,
  }).select()
  throwIfError(error)
  return data || []
}

// 更新网站
export async function updateSite(id, value) {
  const payload = {
    id,
    category_id: value.category_id,
    sort: toSortValue(value.sort),
    title: value.title,
    logo: value.logo,
    is_used: value.is_used,
    url: value.url,
    logotype: value.logotype || 1,
    description: value.description,
  }
  const { data, error } = await supabase
    .from('site')
    .upsert(payload)
    .eq('id', id)
    .select()
  throwIfError(error)
  return data || []
}

// 删除网站
export async function delSite(ids) {
  const { error } = await supabase
    .from('site')
    .delete()
    .in('id', ids)
  throwIfError(error)
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  throwIfError(error)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  throwIfError(error)
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  throwIfError(error)
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  throwIfError(error)
  return data.user
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password })
  throwIfError(error)
  return data
}

export async function uploadFile(avatarFile) {
  const file = avatarFile.raw
  const ext = getFileExt(file)
  const filekey = `logos/${Date.now()}-${md5(`${file.name}-${file.size}-${file.lastModified}`)}.${ext}`
  const { data, error } = await supabase
    .storage
    .from(config.supabaseBucketName)
    .upload(filekey, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })
  throwIfError(error)
  const fileurl = getFileUrl(filekey)
  return { data, filekey, fileurl }
}

export function getFileUrl(filekey) {
  const { data } = supabase.storage.from(config.supabaseBucketName).getPublicUrl(filekey)
  return data.publicUrl
}
