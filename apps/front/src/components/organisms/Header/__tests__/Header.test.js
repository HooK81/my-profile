/**
 * Header Test Suites
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header.js';
import { historyPushMock, setDefaultLcationMock } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

const initializeDom = (hashId) => {
  document.body.innerHTML =
    `<div style="height: 5000px;"><div id="upper" style="height: 4000px;">test</div><div id="${hashId}">${hashId}</div></div>`;

  global.document.getElementById(hashId).getBoundingClientRect = jest.fn(
    () => ({
      top: 0,
      left: 0,
      right: 500,
      bottom: 1000,
      width: 500,
      height: 1000,
    }),
  );
};

const setViewPortSize = (width, height) => {
  window.innerWidth = width;
  window.innerHeight = height;
  fireEvent(window, new Event('resize'));
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should Header render without crash', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Header id="foo" home={true} />
      </BrowserRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should Header can update header height property on resize on home page', async () => {
    setViewPortSize(1000,1000);
    const onResizeMock = jest.fn();
    render(
      <BrowserRouter>
        <Header id="foo" home={true} onResize={onResizeMock} />
      </BrowserRouter>,
    );
    await waitFor(() =>
      expect(onResizeMock).toHaveBeenLastCalledWith({
        height: 1000,
        width: 1000,
      }),
    );

    // Then update size of window
    setViewPortSize(300,1000);
    await waitFor(() =>
      expect(onResizeMock).toHaveBeenLastCalledWith({
        height: 1000,
        width: 300,
      }),
    );
  });

  it("should Header don't update header height property on resize for non home page", async () => {
    setDefaultLcationMock({
      pathname: '/foo',
      hash: '',
    });
    setViewPortSize(1000,1000);
    const onResizeMock = jest.fn();
    render(
      <BrowserRouter>
        <Header id="foo" home={false} onResize={onResizeMock} />
      </BrowserRouter>,
    );
    await waitFor(() => expect(onResizeMock).not.toHaveBeenCalled(), {
      timeout: 400,
    });
  });

  it('should Header add history after scroll to hash', async () => {
    initializeDom('resume');
    setDefaultLcationMock({
      pathname: '/',
      hash: 'resume',
    });
    render(
      <BrowserRouter>
        <Header id="foo" home={true} />
      </BrowserRouter>,
    );
    const link = await screen.findByText('menu.resume');
    fireEvent.click(link);

    await waitFor(() =>
      expect(historyPushMock).toHaveBeenCalledWith({
        hash: 'resume',
        pathname: '/',
      }),
    );
  });

  it('should Header do not add history - home - click on home', async () => {
    initializeDom('home');
    setDefaultLcationMock({
      pathname: '/',
      hash: '#home',
    });
    render(
      <BrowserRouter>
        <Header id="foo" home={true} />
      </BrowserRouter>,
    );
    const link = await screen.findByText('menu.home');
    fireEvent.click(link);

    await waitFor(() => expect(historyPushMock).not.toHaveBeenCalled(), {
      timeout: 400,
    });
  });

  it('should Header do not add history - no location - click on home', async () => {
    initializeDom('resume');
    setDefaultLcationMock({
      pathname: '/',
      hash: '',
    });
    render(
      <BrowserRouter>
        <Header id="foo" home={true} />
      </BrowserRouter>,
    );
    const link = await screen.findByText('menu.home');
    fireEvent.click(link);
    await waitFor(() => expect(historyPushMock).not.toHaveBeenCalled(), {
      timeout: 400,
    });
  });

  it('should Header handle invalid hash link', async () => {
    initializeDom('home');
    setDefaultLcationMock({
      pathname: '/',
      hash: '',
    });
    render(
      <BrowserRouter>
        <Header id="foo" home={true} />
      </BrowserRouter>,
    );
    const link = await screen.findByText('menu.resume');
    fireEvent.click(link);
    await waitFor(() =>
      expect(historyPushMock).toHaveBeenCalledWith({
        hash: 'resume',
        pathname: '/',
      }),
    );
  });
});
