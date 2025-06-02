import axios from 'axios';
import { Backend } from '../data';

export class TecrepUserMenuPreferencesService {

  static fetch(login) {
    const navigatorLanguage = (navigator.languages && navigator.languages[0] || navigator.language).split('-')[0].toUpperCase();
    const fallback = {id: null, userId: null, language: navigatorLanguage, preferences: {}};
    return Backend.settings.userMenuPreferences.enabled
      ? axios.get(Backend.settings.userMenuPreferences.url + '/getPreference', {params: {login}, withCredentials: true})
      .then(res => res.data.result ? ({...res.data.result, preferences: JSON.parse(res.data.result.preferences)}) : fallback)
      .catch(err => Promise.reject(err))
      : Promise.resolve(fallback);
  }

  static create(userMenu, login) {
    const request = {...userMenu, preferences: JSON.stringify(userMenu.preferences)};
    return Backend.settings.userMenuPreferences.enabled
      ? axios.post(Backend.settings.userMenuPreferences.url + '/add', request, {params: {login}, withCredentials: true})
      .then(() => true)
      .catch(() => false)
      : Promise.resolve(false);
  }

  static update(userMenu) {
    const request = {...userMenu, preferences: JSON.stringify(userMenu.preferences)};
    return Backend.settings.userMenuPreferences.enabled
      ? axios.put(Backend.settings.userMenuPreferences.url + '/update', request, {withCredentials: true})
      .then(() => true)
      .catch(() => false)
      : Promise.resolve(false);
  }
}
