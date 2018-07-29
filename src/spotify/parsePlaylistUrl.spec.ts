import parsePlaylistUrl from './parsePlaylistUrl'

describe('parsePlaylistUrl', () => {
  const sampleUrl =
    'https://open.spotify.com/user/1155695100/playlist/2Vb5zquQt3uuCO8or2grou'

  it('should return undefinied if url cannot be parsed', () => {
    expect(parsePlaylistUrl('')).toBeUndefined()
  })

  it('should parse playlist query details from a playlist url', () => {
    expect(parsePlaylistUrl(sampleUrl)).toEqual({
      userName: '1155695100',
      playlistId: '2Vb5zquQt3uuCO8or2grou'
    })
  })

  it('should handle url decoding', () => {
    const encodedUrl = 'https://open.spotify.com/user/willpmartin%21/playlists/6ADJbaA9dAJ88VvjuQoZPt'
    expect(parsePlaylistUrl(encodedUrl)).toEqual({
      userName: 'willpmartin!',
      playlistId: '6ADJbaA9dAJ88VvjuQoZPt'
    })
  })
})
