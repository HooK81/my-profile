const originalModule = jest.requireActual('react-i18next');
module.exports = {
  __esModule: true,
  ...originalModule,
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (key) => key };
    return Component;
  },
  useTranslation: () => ({
    t: key => key,
  }),
}
