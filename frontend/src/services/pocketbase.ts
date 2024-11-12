import PocketBase from 'pocketbase'

export function newPb() {
  return new PocketBase(import.meta.env.VITE_BACKEND_URL)
}
