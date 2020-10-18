/**
 * Techs Test Suites
 * @author Julien CROCHET <julien@crochet.me>
 */
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Techs } from '../Techs.js';

const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    wrapper.update();
  });
};

describe('Techs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should Techs render without crash', async () => {
    const techs = [
      { name: 'test', desc: 'desc', image: 'php.jpg' },
      { name: 'test', desc: 'desc', image: 'php.jpg' },
    ];
    const wrapper = mount(<Techs techs={techs} />);
    waitForComponentToPaint(wrapper);

    await new Promise((done) =>
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('#techs ul li')).toHaveLength(2);
        done();
      }, 0),
    );

  });
});
