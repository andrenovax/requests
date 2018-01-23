import { get, post, put, del } from './requests';
import { checkString, checkObject } from './helpers';

export class RequestModel {
  constructor(rootUrl) {
    checkString(rootUrl, 'url');
    this.rootUrl = rootUrl;
  }

  static checkId(obj) {
    if (!obj.id) throw new Error('modelItem does not have id');
  }

  all(params = null) {
    return get(this.rootUrl, params, false);
  }

  get(modelItem) {
    RequestModel.checkId(modelItem);
    return get(`${this.rootUrl}/${modelItem.id}`, false);
  }

  add(modelItem) {
    checkObject(modelItem, 'modelItem');
    return post(this.rootUrl, modelItem);
  }

  update(modelItem) {
    RequestModel.checkId(modelItem);
    return put(`${this.rootUrl}/${modelItem.id}`, modelItem);
  }

  delete(modelItem) {
    RequestModel.checkId(modelItem);
    return del(`${this.rootUrl}/${modelItem.id}`, modelItem);
  }

  addOrUpdate(modelItem) {
    checkObject(modelItem, 'modelItem');
    if (modelItem.id) return this.update(modelItem);
    return this.add(modelItem);
  }
}

export default RequestModel;
