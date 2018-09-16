export default function cleanModel(model: any) {
  delete model['aws:rep:deleting']
  delete model['aws:rep:updateregion']
  delete model['aws:rep:updatetime']
  return model
}
