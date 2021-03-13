/**
 * Export connected API with Redux and Synfony routing
 */
import { Api, ApiError } from './Api';
import { store } from '../utils/configureStore';
import { getToken } from '../redux/token/actions';
import { routing } from './routing/index';

const mapDispatchToProps = () => {
  return {
    onGetToken: () => store.dispatch(getToken()),
  };
};

const api = new Api(mapDispatchToProps());
export { api, ApiError, routing };
