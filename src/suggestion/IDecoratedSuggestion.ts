import ITrack from '../spotify/ITrack'
import ISuggestion from './ISuggestion'

export default interface IDecoratedSuggestion {
  suggestion: ISuggestion
  track: ITrack
}
