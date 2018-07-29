import IPlaylistItem from './IPlaylistItem'

export default interface IPlaylistTracks {
  href: string
  total: number
  items: IPlaylistItem[]
}
