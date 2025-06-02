import Actions from '../../actions/Actions';


const settingRedux = (next, action, params, state) => {
  switch (action.type) {
    case Actions.SETTINGS.REQUEST:
      if (params[0]) {
        next({type: Actions.LOGIN.DATA, payload: Object.assign({}, state.session.payload, {language: params[0]}), params: params});
        return true;
      }
      return false;
    default:
      return false;
  }
};

export default settingRedux;
