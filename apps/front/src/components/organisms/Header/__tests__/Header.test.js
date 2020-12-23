/**
 * Header Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { Header } from '../Header.js';
import { Nav } from '../../../organisms/Nav/Nav';
import { historyPushMock, setDefaultLcationMock } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Header render without crash', () => {
    const wrapper = shallow(<Header id="foo" home={true} />);
    expect(wrapper.find('header#foo')).toHaveLength(1);
    expect(wrapper.find(Nav)).toHaveLength(1);
  });

  it('Should Header can update header height property on resize on home page', async () => {
    // First mount with a specific size
    global.innerHeight = '1000';
    const wrapper = mount(
      <BrowserRouter>
        <Header id="foo" home={true}/>
      </BrowserRouter>,
    );
    expect(wrapper.find('header#foo').instance().getAttribute('style')).toBe('height: 1000px;');

    // Then update size of window
    global.innerHeight = '300';
    await act(async () => {
      global.dispatchEvent(new Event('resize'));

      await new Promise((done) =>
        setTimeout(() => {
          expect(wrapper.find('header#foo').instance().getAttribute('style')).toBe('height: 300px;');
          done();
        }, 400),
      );
    });
  });

  it('Should Header don\'t update header height property on resize for non home page', async () => {
    setDefaultLcationMock({
      pathname: '/foo',
      hash: ''
    })
    // First mount with a specific size
    global.innerHeight = '1000';
    const wrapper = mount(
      <BrowserRouter>
        <Header id="foo" home={false}/>
      </BrowserRouter>,
    );
    expect(wrapper.find('header#foo').instance().getAttribute('style')).toBe(null);
  });

  it('Should Header add history after scroll to hash', async () => {
    setDefaultLcationMock({
      pathname: '/',
      hash: 'foo'
    })
    const wrapper = shallow(<Header id="foo" home={true}/>);
    wrapper.find(Nav).prop('onSetActiveAfterScroll')('foo');

    await new Promise((done) =>
      setTimeout(() => {
        expect(historyPushMock).toHaveBeenCalledWith({hash: 'foo', pathname: '/'});
        done();
      }, 400),
    );
  });

  it('Should Header do not add history 1', async () => {
    setDefaultLcationMock({
      pathname: '/',
      hash: '#home'
    })
    const wrapper = shallow(<Header id="foo" home={true}/>);
    wrapper.find(Nav).prop('onSetActiveAfterScroll')('home');

    await new Promise((done) =>
      setTimeout(() => {
        expect(historyPushMock).toHaveBeenCalledTimes(0);
        done();
      }, 400),
    );
  });

  it('Should Header do not add history 2', async () => {
    setDefaultLcationMock({
      pathname: '/',
      hash: ''
    })
    const wrapper = shallow(<Header id="foo" home={true}/>);
    wrapper.find(Nav).prop('onSetActiveAfterScroll')('home');

    await new Promise((done) =>
      setTimeout(() => {
        expect(historyPushMock).toHaveBeenCalledTimes(0);
        done();
      }, 400),
    );
  });

  it('Should Header do not add history 3', async () => {
    setDefaultLcationMock({
      pathname: '/',
      hash: ''
    })
    const wrapper = shallow(<Header id="foo" home={true}/>);
    wrapper.find(Nav).prop('onSetActiveAfterScroll')('');

    await new Promise((done) =>
      setTimeout(() => {
        expect(historyPushMock).toHaveBeenCalledTimes(0);
        done();
      }, 400),
    );
  });

  it('Should Header handle invalid hash link', async () => {
    setDefaultLcationMock({
      pathname: '/',
      hash: 'foo'
    })
    const wrapper = shallow(<Header id="foo" home={true}/>);
    wrapper.find(Nav).prop('onScrollLinkError')({pathname: '/', hash: 'foo'});

    await new Promise((done) =>
      setTimeout(() => {
        expect(historyPushMock).toHaveBeenCalledWith({hash: 'foo', pathname: '/'});
        done();
      }, 400),
    );
  });

});
