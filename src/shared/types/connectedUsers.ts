export interface IConnectedUser {
  sid?: number | null,
  login?: string | undefined,
  uid?: number | null,
  nickName?: string | undefined,
  gender?: 'male' | 'female',
  adminLvl?: number | null,
  age?: number | null,
  cash?: number | null,
  bankmoney?: number | null,
  donatcoins?: number | null,
  lvl?: number | null,
  exp?: number | null,
  unique_quest?: string | null
}