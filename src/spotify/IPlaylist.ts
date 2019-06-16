import IExternalUrls from './IExternalUrls'
import IFollowers from './IFollowers'
import IImage from './IImage'
import IPlaylistOwner from './IPlaylistOwner'
import IPlaylistTracks from './IPlaylistTracks'

export default interface IPlaylist {
  collaborative: boolean
  external_urls: IExternalUrls
  href: string
  id: string
  images: IImage[]
  name: string
  owner: IPlaylistOwner
  primary_color?: string
  public: boolean
  snapshot_id: string
  tracks: IPlaylistTracks
  type: string
  uri: string
  followers?: IFollowers
}
