import IPlaylistQuery from './IPlaylistQuery'

export default function parsePlaylistUrl(
  playlistUrl: string
): IPlaylistQuery | undefined {
  try {
    const splitUrl = playlistUrl.split('/')
    const playlistId = splitUrl[splitUrl.length - 1]
    const userName = decodeURIComponent(splitUrl[splitUrl.length - 3])

    if (!playlistId || !userName) {
      throw new Error()
    }

    return {
      playlistId,
      userName
    }
  } catch (err) {
    return undefined
  }
}
