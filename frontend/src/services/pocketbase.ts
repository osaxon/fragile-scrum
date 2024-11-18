import { TypedPocketBase } from '@/types/pocketbase-types'
import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_BACKEND_URL || 'http:/localhost:8090'

export const pb = new PocketBase(pbUrl) as TypedPocketBase
