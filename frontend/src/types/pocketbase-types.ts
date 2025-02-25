/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Rooms = "rooms",
	Settings = "settings",
	Stories = "stories",
	Tasks = "tasks",
	Users = "users",
	Votes = "votes",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type RoomsRecord = {
	activeStory?: RecordIdString
	created?: IsoDateString
	id: string
	members?: RecordIdString[]
	name?: string
	updated?: IsoDateString
	user?: RecordIdString
}

export enum SettingsThemeOptions {
	"system" = "system",
	"light" = "light",
	"dark" = "dark",
}
export type SettingsRecord = {
	created?: IsoDateString
	id: string
	remindByEmailEnabled?: boolean
	remindEmail?: string
	theme: SettingsThemeOptions
	updated?: IsoDateString
	user: RecordIdString
}

export type StoriesRecord = {
	created?: IsoDateString
	id: string
	name?: string
	room?: RecordIdString
	updated?: IsoDateString
}

export type TasksRecord<Thistory = unknown> = {
	category?: string
	created?: IsoDateString
	daysRemind?: number
	daysRepeat: number
	description?: string
	history?: null | Thistory
	id: string
	name: string
	remindByEmail?: boolean
	repeatGoalEnabled?: boolean
	updated?: IsoDateString
	user: RecordIdString
}

export type UsersRecord = {
	authWithPasswordAvailable?: boolean
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

export type VotesRecord = {
	created?: IsoDateString
	id: string
	score?: number
	story?: RecordIdString
	updated?: IsoDateString
	user?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type SettingsResponse<Texpand = unknown> = Required<SettingsRecord> & BaseSystemFields<Texpand>
export type StoriesResponse<Texpand = unknown> = Required<StoriesRecord> & BaseSystemFields<Texpand>
export type TasksResponse<Thistory = unknown, Texpand = unknown> = Required<TasksRecord<Thistory>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VotesResponse<Texpand = unknown> = Required<VotesRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	rooms: RoomsRecord
	settings: SettingsRecord
	stories: StoriesRecord
	tasks: TasksRecord
	users: UsersRecord
	votes: VotesRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	rooms: RoomsResponse
	settings: SettingsResponse
	stories: StoriesResponse
	tasks: TasksResponse
	users: UsersResponse
	votes: VotesResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'rooms'): RecordService<RoomsResponse>
	collection(idOrName: 'settings'): RecordService<SettingsResponse>
	collection(idOrName: 'stories'): RecordService<StoriesResponse>
	collection(idOrName: 'tasks'): RecordService<TasksResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'votes'): RecordService<VotesResponse>
}
