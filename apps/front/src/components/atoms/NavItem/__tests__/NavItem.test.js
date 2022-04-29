/**
 * ProfilePicture Test Suites
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavItem } from '../NavItem.js';
import { BrowserRouter } from 'react-router-dom';

const onClick = jest.fn();
const onSetActive = jest.fn();
const onScrollLinkError = jest.fn();

describe('NavItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up a fake document body
    document.body.innerHTML =
      '<div style="height: 5000px;"><div id="upper" style="height: 4000px;">test</div><div id="hash">hash</div></div>';
  });

  it('should NavItem render link to inner hash without crash', async () => {

    // Mock rect of hash element
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(
      () => ({
        top: 0,
        left: 0,
        right: 500,
        bottom: 1000,
        width: 500,
        height: 1000,
      }),
    );

    const { asFragment } = render(
      <NavItem
        label="anchor label"
        to={{ pathname: '/', hash: 'hash' }}
        activeClass="active"
        smoothDuration={1}
        smoothOffset={0}
        onSetActive={onSetActive}
        onClick={onClick}
      />,
    );
    const link = await screen.findByText('anchor label');
    fireEvent.click(link);
    await waitFor(() => expect(onClick).toHaveBeenCalled());
    await waitFor(() => expect(onSetActive).toHaveBeenCalled());
    expect(asFragment()).toMatchSnapshot();
  });

  it('should NavItem handle click on wrong inner hash link', async () => {
    // Mock rect of hash element
    global.document.getElementById('hash').getBoundingClientRect = jest.fn(
      () => ({
        top: 0,
        left: 0,
        right: 500,
        bottom: 1000,
        width: 500,
        height: 1000,
      }),
    );

    const { asFragment } = render(
      <NavItem
        label="anchor label"
        to={{ pathname: '/', hash: 'foo' }}
        activeClass="active"
        smoothDuration={1}
        smoothOffset={0}
        onSetActive={onSetActive}
        onClick={onClick}
        onScrollLinkError={onScrollLinkError}
      />,
    );

    const link = await screen.findByText('anchor label');
    fireEvent.click(link);
    await waitFor(() => expect(onClick).toHaveBeenCalled());
    await waitFor(() => expect(onScrollLinkError).toHaveBeenCalled());
    await waitFor(() => expect(onSetActive).not.toHaveBeenCalled());
    expect(asFragment()).toMatchSnapshot();
  });

  it('should NavItem render link to other page without crash', async () => {
    const { asFragment } = render(
      <BrowserRouter>
        <NavItem
          label="label"
          to={{ pathname: '/other' }}
          onClick={onClick}
        />
      </BrowserRouter>,
    );
    const link = await screen.findByRole('link');
    expect(asFragment()).toMatchSnapshot();
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });
});
