import { TypedPocketBase } from '@/types/pocketbase-types'
import PocketBase from 'pocketbase'

export const pb = new PocketBase(
  import.meta.env.VITE_BACKEND_URL
) as TypedPocketBase
