import { logError } from '../logging'
import { Suggestion } from '../model'
import ISuggestion from './ISuggestion'
import { onSuggestionsAccepted, onSuggestionSaved } from './suggestionNotifier'

export default class SuggestionGateway {
  public bulkCreateSuggestion(suggestions: ISuggestion[]) {
    return new Promise((resolve, reject) => {
      Suggestion.create(suggestions, (err: Error, suggestionModel: any) => {
        if (err) {
          reject(err)
        } else {
          onSuggestionSaved(suggestionModel)
          resolve(suggestionModel)
        }
      })
    })
  }

  public createSuggestion(suggestion: ISuggestion) {
    return new Promise((resolve, reject) => {
      Suggestion.create(suggestion, (err: Error, suggestionModel: any) => {
        if (err) {
          reject(err)
        } else {
          onSuggestionSaved(suggestionModel.attrs)
          resolve(suggestionModel.attrs)
        }
      })
    })
  }

  public acceptSuggestions(eventId: string, suggestions: ISuggestion[]) {
    const updatePromises: any = []
    suggestions.map(suggestion => {
      updatePromises.push(Suggestion.update({ ...suggestion, accepted: true }))
    })
    return Promise.all(updatePromises).then(values => {
      onSuggestionsAccepted(eventId)
      return values
    })
  }

  public deleteSuggestion(suggestionId: string, eventId: string) {
    return new Promise((resolve, reject) => {
      Suggestion.destroy(suggestionId, eventId, (err: Error) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  public getSuggestionById(suggestionId: string) {
    return new Promise((resolve, reject) => {
      Suggestion.query(suggestionId).exec(
        (err: Error, suggestionModel: any) => {
          if (err) {
            logError('Suggestion Error', err)
            reject(err)
          } else if (suggestionModel.Count < 1) {
            reject(new Error('Not found'))
          } else {
            resolve(suggestionModel.Items[0].attrs)
          }
        }
      )
    })
  }

  public getSuggestionsByEventId(eventId: string) {
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

  public getSuggestionsByUserIdAndEventId(userId: string, eventId: string) {
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

  public async rejectSuggestion(suggestionId: string) {
    const suggestion = await this.getSuggestionById(suggestionId)
    return await Suggestion.update({
      ...suggestion,
      accepted: false,
      rejected: true
    })
  }
}
