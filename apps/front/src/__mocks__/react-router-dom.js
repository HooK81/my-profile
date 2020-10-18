const originalModule = jest.requireActual('react-router-dom');
const pushFn = jest.fn();
let defaultLocationMock = {
  pathname: '/',
};

module.exports = {
  __esModule: true,
  ...originalModule,
  useLocation: () => (defaultLocationMock),
  useHistory: () => ({
    push: pushFn,
  }),
  historyPushMock: pushFn,
  defaultLocationMock: {
    pathname: '/',
  },
  setDefaultLcationMock: (location) => {
    defaultLocationMock = location
  }
}
