import React from 'react';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
 import * as selectMethods from 'react-select';

import * as detect from '../../../utils/detect';
import BaseSelect from './BaseSelect';
import Theme, { THEMES } from '../../../utils/theme';
import BaseOption from './Option/BaseOption';

jest.mock('../../../utils/detect'); 

describe('BaseSelect component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        detect.isTouchDevice.mockReset();

        const mockProps = getMockProps();
        const mockContext = getMockContext();

        BaseSelect.contextTypes = {
            theme: PropTypes.string
          }
        wrapper = shallow(<BaseSelect {...mockProps} />,{context:mockContext});
        instance = wrapper.instance();

    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

   describe('shouldMenuSelectRender()', () => {
        it('is touch device', () => {
            detect.isTouchDevice = jest.fn().mockReturnValue(true);

            expect(instance.shouldMenuSelectRender()).toBeTruthy();
        });

        it('is not touch device', () => {
            detect.isTouchDevice = jest.fn().mockReturnValue(false);

            expect(instance.shouldMenuSelectRender()).toBeFalsy();
        });
    });


    describe('should filter options()', () => {
        it('should filter options only  by label ', () => {
            wrapper.setProps({
                settings:{
                    isSearchable: true,
                },
                isSearchByValue: false
            })
            spyOn(selectMethods, 'createFilter');

            instance.getFilterOption();
            expect(selectMethods.createFilter).toHaveBeenCalled()
        });

        it('should filter options by label and value ', () => {
            wrapper.setProps({
                settings:{
                    isSearchable: true,
                },
                isSearchByValue: true
            })

            const filterOption =instance.getFilterOption();
            expect(filterOption).toBeNull()
        });
    });

    function getMockProps() {
        return {
            options : []
        };
    }

    function getMockContext() {
        return {
            theme : 'LIGHT'
        };
    }
});

