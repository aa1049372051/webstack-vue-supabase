import router from './router'
import { getSession } from './utils/supabase'

const notNeedLogin = [
  'index', 'about', 'home'
]

router.beforeEach(async (to, from, next) => {
  if (!to.name) {
    next({
      name: 'index',
      query: to.query,
    })
    return
  }

  if (notNeedLogin.indexOf(to.name) > -1) {
    next()
    return
  }

  try {
    const session = await getSession()
    if (!session && to.name !== 'admin_login') {
      next({
        name: 'admin_login',
        query: to.query,
      })
      return
    }

    if (session && to.name === 'admin_login') {
      next({ name: 'admin_index' })
      return
    }

    next()
  } catch (error) {
    if (to.name !== 'admin_login') {
      next({ name: 'admin_login' })
      return
    }
    next()
  }
})
