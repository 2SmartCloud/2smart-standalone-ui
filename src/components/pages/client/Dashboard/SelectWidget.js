/* eslint-disable react/no-multi-comp */
/* eslint-disable func-style */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddWidgetSelect from '../../../base/select/AddWidgetSelect';
import WidgetSettingsModal from './WidgetSettingsModal';
import * as WidgetActions from './../../../../actions/client/widget';

class SelectWidget extends Component {
    state = {
        isModalOpened : false
    };

    handleChange = value => {
        this.props.getTopicsByDataType(value);
        this.props.getGroups(value);
        this.setState({ isModalOpened: true });
    }

    handleCloseModal = () => {
        if (this.props.widgetStore.isFetching) return;

        this.setState({ isModalOpened: false });
        this.props.clearValues();
    }

    handleCreateWidget = async () => {
        const { widgetStore, createWidget, isFetching } = this.props;

        if (!isFetching) {
            await createWidget(widgetStore);
            this.handleCloseModal();

            const grid = document.getElementById('widgetsGrid');

            if (grid) {
                setTimeout(() => {
                    grid.scrollTo({
                        top      : grid.scrollHeight,
                        left     : 0,
                        behavior : 'smooth'
                    });
                }, 200);
            }
        }
    }

    getNoOptionsMessage() {
        return 'Nothing found';
    }

    render() {
        const { isModalOpened } = this.state;
        const { placeholder, customStyles } = this.props;

        return (
            <Fragment>
                <AddWidgetSelect
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    style={customStyles}
                    noOptionsMessage={this.getNoOptionsMessage}
                    darkThemeSupport
                />
                <WidgetSettingsModal
                    isOpen={isModalOpened}
                    onClose={this.handleCloseModal}
                    onSave={this.handleCreateWidget}
                />
            </Fragment>
        );
    }
}

SelectWidget.propTypes = {
    placeholder         : PropTypes.string,
    getTopicsByDataType : PropTypes.func.isRequired,
    createWidget        : PropTypes.func.isRequired,
    clearValues         : PropTypes.func.isRequired,
    getGroups           : PropTypes.func.isRequired,
    widgetStore         : PropTypes.object,
    customStyles        : PropTypes.any,
    isFetching          : PropTypes.bool
};

SelectWidget.defaultProps = {
    placeholder  : '',
    widgetStore  : {},
    customStyles : {},
    isFetching   : false
};

function mapStateToProps(state) {
    return {
        devices     : state.homie.devices,
        widgetStore : state.client.widget
    };
}

export default connect(mapStateToProps, { ...WidgetActions })(SelectWidget);
