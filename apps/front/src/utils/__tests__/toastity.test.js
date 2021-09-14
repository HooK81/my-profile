/**
 * Toastify Test Suites
 */

import React from "react";
import { shallow } from "enzyme";
import  '../toastify';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

describe('Toastify', () => {
  it("Should toastify configured correctly", () => {
    const wrapper = shallow(<ToastContainer />);
    expect(wrapper.find('.Toastify')).toHaveLength(1);
    expect(toast).toBeDefined();
  });
});
