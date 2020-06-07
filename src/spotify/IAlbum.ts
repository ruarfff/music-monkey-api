import IImage from './IImage'

export default interface IAlbum {
  id?: string
  images: IImage[]
  album_type?: string
  type?: string
  artists?: any[]
  available_markets?: string[]
  external_urls?: any
  href?: string
  name?: string
  release_date?: string
  release_date_precision?: string
  total_tracks?: number
  uri?: string
}
