import IAlbum from './IAlbum'

export default interface ITrack {
  id: string
  disc_number?: number
  duration_ms: number
  explicit: boolean
  name: string
  popularity: number
  preview_url: string
  track_number?: number
  type?: string
  track?: boolean
  uri: string
  album: IAlbum
  href?: string
  artists: any[]
  available_markets?: string[]
  episode?: boolean
  external_ids?: any
  external_urls?: any
  is_local?: boolean
}
