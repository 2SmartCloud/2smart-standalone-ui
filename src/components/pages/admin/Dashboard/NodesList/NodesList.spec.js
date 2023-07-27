import React            from 'react';
import { shallow }      from 'enzyme';
import { DEVICES_MOCK } from '../../../../../__mocks__/deviceMock';
import Node             from '../../../../base/Node';
import NodesList        from './index.js';

describe('NodesList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<NodesList {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render nodes', () => {
        const nodesList = wrapper.find(Node);

        expect(nodesList.length).toBe(instance.props.nodes.length);
    });

    it('should not render node with empty sensors', () => {
        wrapper.setProps({
            nodes: [
                ...instance.props.nodes,
                {
                    id        : 'colors2',
                    name      : 'Color picker 2',
                    type      : 'V1',
                    state     : 'ready',
                    rootTopic : 'sweet-home/fat/colors',
                    title     : '',
                    options   : [],
                    telemetry : [],
                    hidden    : 'false'
                }
            ]
        });

        const nodes = wrapper.find(Node);
        expect(nodes).toHaveLength(instance.props.nodes.length - 1);
    });

    function getMockProps() {
        return {
            sortOrder: 'ASC',
            isDeviceDisable : false,
            deviceId        : 'fat',
            nodes           : DEVICES_MOCK.fat.nodes
        }
    };
});
