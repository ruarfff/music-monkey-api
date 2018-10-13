import { Request, Response, Router } from 'express'
// import * as _ from 'lodash'
import * as passport from 'passport'
import { logError } from '../logging'
import ISuggestion from './ISuggestion'
import SuggestionDecorator from './SuggestionDecorator'
import {
  getSuggestionsByUserId,
  getSuggestionsByUserIdAndEventId
} from './suggestionService'

const router = Router()
const suggestionDecorator = new SuggestionDecorator()

/**
 * @swagger
 * /users/suggestions:
 *   get:
 *     tags:
 *       - suggestions
 *     description: Get a users suggestion
 *     summary: Get a users suggestion
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Event ID for filter on
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All suggestions for a user possibly filtered by event
 *         schema:
 *            type: array
 *            items:
 *              type:
 *                $ref: '#/definitions/Suggestion'
 */
router.get(
  '/suggestions',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { user } = req
      let suggestions: ISuggestion[]
      if (req.query.eventId) {
        suggestions = await getSuggestionsByUserIdAndEventId(
          user.userId,
          req.query.eventId
        )
      } else {
        suggestions = await getSuggestionsByUserId(user.userId)
      }

      const decoratedSuggestions = await suggestionDecorator.decorateSuggestions(
        suggestions,
        user
      )

      res.send(decoratedSuggestions)
    } catch (err) {
      logError('Failed to fetch users suggestions', err, req)
      res.status(404).send(err)
    }
  }
)

export default router
