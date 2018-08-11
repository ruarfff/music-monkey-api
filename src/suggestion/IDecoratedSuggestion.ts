import { ISuggestion } from '../model'
import ITrack from '../spotify/ITrack'

export default interface IDecoratedSuggestion {
  suggestion: ISuggestion
  track: ITrack
}
