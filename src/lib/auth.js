import jwtDecode from 'jwt-decode'

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}


export function getUserFromToken() {
  const token = getToken()
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}
