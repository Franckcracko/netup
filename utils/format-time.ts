export const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / (1000))

  if (diffInHours < 1 && diffInMinutes < 1) return `Hace ${diffInSeconds}s`
  if (diffInHours < 1) return `Hace ${diffInMinutes}m`
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  if (diffInHours < 720) return `Hace ${Math.floor(diffInHours / 24)}días`
  if (diffInHours < 8760) return `Hace ${Math.floor(diffInHours / 720)}meses`

  return `Hace ${Math.floor(diffInHours / 8760)} años`
}