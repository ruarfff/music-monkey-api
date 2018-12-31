import ITrack from '../spotify/ITrack'

export const findDuplicatedTracks = (tracks: ITrack[]) => {
  const seenIds = new Map<string, boolean>()
  const seenNameAndArtist = new Map<string, number>()
  const result = tracks.reduce((duplicates, track, index) => {
    if (!track || !track.id) {
      return duplicates
    }
    let isDuplicate = false
    const seenNameAndArtistKey = `${track.name}:${track.artists[0].name}`
    if (seenIds.has(track.id)) {
      // if the two tracks have the same Spotify ID, they are duplicates
      isDuplicate = true
    } else {
      // if they have the same name, main artist, and roughly same duration
      // we consider tem duplicates too
      if (
        seenNameAndArtist.has(seenNameAndArtistKey) &&
        Math.abs(
          seenNameAndArtist.get(seenNameAndArtistKey) - track.duration_ms
        ) < 2000
      ) {
        isDuplicate = true
      }
    }
    if (isDuplicate) {
      duplicates.push({
        index,
        track,
        reason: seenIds.has(track.id) ? 'same-id' : 'same-name-artist'
      })
    } else {
      seenIds.set(track.id, true)
      seenNameAndArtist.set(seenNameAndArtistKey, track.duration_ms)
    }
    return duplicates
  }, [])
  return result
}
