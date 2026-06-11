export default defineNuxtRouteMiddleware(async (to, from) => {
  const { token, user, fetchUser, isAuthenticated } = useAuth()

  // If there is a token but no user object, fetch user data first
  if (token.value && !user.value) {
    await fetchUser()
  }

  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
