import { promisify } from 'util'
import { Suggestion } from '../model'
import ISuggestion from './ISuggestion'

export const fetchSuggestionById = (suggestionId: string) => {
  return new Promise<ISuggestion>((resolve, reject) => {
    Suggestion.query(suggestionId).exec((err: Error, suggestionModel: any) => {
      if (err) {
        reject(err)
      } else if (suggestionModel.Count < 1) {
        reject(new Error('Not found'))
      } else {
        resolve(suggestionModel.Items[0].attrs)
      }
    })
  })
}

export const fetchSuggestionsByEventId = (eventId: string) => {
  return new Promise<ISuggestion[]>((resolve: any, reject: any) => {
    Suggestion.query(eventId)
      .usingIndex('UserEventIdIndex')
      .exec((err: Error, suggestionModel: any) => {
        if (err) {
          reject(err)
        } else {
          const suggestionList = suggestionModel.Items.map(
            (item: any) => item.attrs
          )
          resolve(suggestionList)
        }
      })
  })
}

export const fetchSuggestionsByUserIdAndEventId = (
  userId: string,
  eventId: string
) => {
  return new Promise<ISuggestion[]>((resolve: any, reject: any) => {
    Suggestion.query(eventId)
      .where('userId')
      .equals(userId)
      .usingIndex('UserEventIdIndex')
      .exec((err: Error, suggestionModel: any) => {
        if (err) {
          reject(err)
        } else {
          const suggestionList = suggestionModel.Items.map(
            (item: any) => item.attrs
          )
          resolve(suggestionList)
        }
      })
  })
}

export const fetchSuggestionsByUserId = (userId: string) => {
  return new Promise<ISuggestion[]>((resolve: any, reject: any) => {
    Suggestion.query(userId)
      .usingIndex('UserIdIndex')
      .exec((err: Error, suggestionModel: any) => {
        if (err) {
          reject(err)
        } else {
          const suggestionList = suggestionModel.Items.map(
            (item: any) => item.attrs
          )
          resolve(suggestionList)
        }
      })
  })
}

export const saveSuggestions = async (suggestions: ISuggestion[]) => {
  const suggestionModel = await promisify(Suggestion.create)(suggestions)
  return suggestionModel
}

export const saveSuggestion = async (suggestion: ISuggestion) => {
  const { attrs } = await promisify(Suggestion.create)(suggestion)
  const savedSuggestion = attrs
  return savedSuggestion
}

export const saveSuggestionsAsAccepted = (suggestions: ISuggestion[]) => {
  const updatePromises: Array<Promise<ISuggestion>> = []
  suggestions.map(suggestion => {
    updatePromises.push(Suggestion.update({ ...suggestion, accepted: true }))
  })
  return Promise.all(updatePromises)
}

export const saveSuggestionAsRejected = async (suggestionId: string) => {
  const suggestion = await fetchSuggestionById(suggestionId)
  return await promisify(Suggestion.update)({
    ...suggestion,
    accepted: false,
    rejected: true
  })
}

export const destroySuggestion = async (
  suggestionId: string,
  eventId: string
) => {
  return await Suggestion.destroy(suggestionId, eventId)
}
