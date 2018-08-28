import { Router } from 'express'
import * as passport from 'passport'
import { spotifyScopes } from './authConstants'
import { handleCallback } from './authRequestLib'

const router = Router()
const hostsUrl = 'https://hosts.musicmonkey.io'
const devUrl = 'http://localhost:3001'

router.get(
  '/spotify-host',
  passport.authenticate('spotify-host', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/spotify-host-local',
  passport.authenticate('spotify-host-local', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/spotify-host-local-dev',
  passport.authenticate('spotify-host-local-dev', {
    scope: spotifyScopes,
    showDialog: true
  } as any),
  () => {
    // The request will be redirected to spotify for authentication
  }
)

router.get(
  '/host/spotify/callback/local/dev',
  passport.authenticate('spotify-host-local-dev', {
    failureRedirect: devUrl + '/login',
    session: false
  } as any),
  handleCallback(devUrl)
)

router.get(
  '/host/spotify/callback/local',
  passport.authenticate('spotify-host-local', {
    failureRedirect: devUrl + '/login',
    session: false
  } as any),
  handleCallback(devUrl)
)

router.get(
  '/host/spotify/callback',
  passport.authenticate('spotify-host', {
    failureRedirect: hostsUrl + '/login',
    session: false
  } as any),
  handleCallback(hostsUrl)
)

export default router
