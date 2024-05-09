
import { createClient } from '@supabase/supabase-js'
import config from '@/config.js'
import md5 from 'js-md5';


const supabaseUrl = config.supabaseUrl
// const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey = config.supabaseKey
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase


//获取首页数据
export async function getMainList() {
    const { data } = await supabase
        .from("category")
        .select(
            `*,site(
  title,url,logo,description,logotype
),children(*,site(
  title,url,logo,description,logotype
))`
        )
        .order('sort', { ascending: true })
        .eq("parent_id", 0);
    return data;
}

export async function getCategoryList() {
    const { data } = await supabase
        .from("category")
        .select(
            `*,father(name),site(*),children(*)`,
        )
        .order('id', { ascending: true })
    return data;
}

export async function getFirstCategoryList() {
    const { data } = await supabase
        .from("category")
        .select(
            `*,father(name),site(*),children(*)`,
        ).eq('parent_id', 0)
    return data;
}

//添加分类
export async function addCategory(item, pid = 0) {
    const data = await supabase
        .from("category")
        .insert({
            name: item.name,
            en_name: item.en_name,
            icon: item.icon,
            parent_id: pid,
        })
        .select();
    return data;
}

//更新分类
export async function updateCategory(id, value) {
    const { data } = await supabase
        .from('category')
        .upsert(value)
        .eq('id', id)
        .select()
    return data;
}

//删除分类
export async function delCategory(ids) {
    const { error } = await supabase
        .from('category')
        .delete()
        .in('id', ids)
    return error
}

export async function getSiteList() {
    const { data } = await supabase
        .from("site")
        .select(
            `*,category(*,father(*))`
        )
        .order('id', { ascending: true })
    return data;
}

//插入网站
export async function addSite(item, pid) {
    let data = await supabase.from("site").insert({
        url: item.url,
        logo: item.logo,
        title: item.title,
        description: item.description,
        category_id: pid,
    }).select();
    return data;
}

//更新网站
export async function updateSite(id, value) {
    const { data } = await supabase
        .from('site')
        .upsert(value)
        .eq('id', id)
        .select()
    return data;
}

//删除网站
export async function delSite(ids) {
    const { error } = await supabase
        .from('site')
        .delete()
        .in('id', ids)
    return error
}


export async function getUser(username, password) {
    const { data } = await supabase
        .from("users")
        .select(
            `*`
        )
        .eq('password', password)
        .eq('username', username);
    return data;
}

export async function updateUser(id, value) {
    const { data } = await supabase
        .from('users')
        .upsert(value)
        .eq('id', id)
        .select()
    return data;
}


export async function uploadFile(avatarFile) {
    let file = avatarFile.raw
    let filekey = md5(file.name)
    const { data, error } = await supabase
        .storage
        .from(config.supabaseBucketName)
        .upload(filekey, file, {
            cacheControl: '3600',
            upsert: true
        })
    let fileurl = getFileUrl(filekey)
    return { data, error, filekey, fileurl }
}

export function getFileUrl(filekey) {
    const { data } = supabase.storage.from(config.supabaseBucketName).getPublicUrl(filekey)
    return data.publicUrl
}

