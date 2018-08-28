import ITrack from '../spotify/ITrack'
import IUser from '../user/IUser'
import ISuggestion from './ISuggestion'

export default interface IDecoratedSuggestion {
  user: IUser
  suggestion: ISuggestion
  track: ITrack
}
