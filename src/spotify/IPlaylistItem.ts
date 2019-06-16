import ITrack from './ITrack'

export default interface IPlaylistItem {
    added_at: string,
    added_by: any,
    is_local: boolean,
    primary_color: any,
    video_thumbnail: any,
    track: ITrack
}
