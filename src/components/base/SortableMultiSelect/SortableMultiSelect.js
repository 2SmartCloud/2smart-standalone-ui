import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import TopicSelect              from '../select/TopicSelect';
import ValuesContainer          from './ValuesContainer';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class SortableTopicsMultiSelect extends PureComponent {
    static propTypes = {
        options         : PropTypes.array.isRequired,
        isInvalid       : PropTypes.bool,
        onValueSelect   : PropTypes.func.isRequired,
        onOrderChange   : PropTypes.func.isRequired,
        values          : PropTypes.array.isRequired,
        emptyMessages   : PropTypes.array,
        onValueDelete   : PropTypes.func,
        placeholder     : PropTypes.string,
        classes         : PropTypes.object,
        mobileTitle     : PropTypes.string,
        placeholderType : PropTypes.string
    }

    static defaultProps = {
        classes         : {},
        isInvalid       : false,
        emptyMessages   : [],
        placeholder     : '',
        mobileTitle     : '',
        onValueDelete   : undefined,
        placeholderType : ''
    };


    handleOptionAttach =  value => {
        this.props.onValueSelect(value);
    }

    handleValueDelete = value => {
        const { onValueDelete } = this.props;

        if (onValueDelete) onValueDelete(value);
    }

    handleChangeOrder=(source, destination) => {
        this.props.onOrderChange(source, destination);
    }

    renderEmptyMessage = () => {
        const { emptyMessages } = this.props;

        return (
            <div className={styles.infoWrapper}>
                <div className={styles.infoLabel}>
                    {
                        emptyMessages.map((line, index) => (
                            <p key={index}> {/* eslint-disable-line react/no-array-index-key*/}
                                {line}
                            </p>
                        ))
                    }
                </div>
            </div>
        );
    };

    render = () => {
        const { options, values, placeholder, classes, isInvalid, mobileTitle, placeholderType } = this.props;
        const isValuesExist = values.length;
        const selectedValuesNames = values.reduce((prev, curr) => [ ...prev, curr.topic ], []);
        const optionsToSelect = options.filter(({ topic }) => !selectedValuesNames?.includes(topic));

        return (
            <div className={cx(styles.MultiSelect, classes.selectWrapper)}>
                <div className={styles.select}>
                    <TopicSelect
                        {...this.props}
                        value             = ''
                        hideSelectedOptions
                        mobileTitle       = {mobileTitle}
                        blurInputOnSelect = {false}
                        selectType        = 'topic'
                        maxMenuHeight     = {245}
                        placeholder       = {placeholder}
                        classNamePrefix   = 'multi'
                        onChange          = {this.handleOptionAttach}
                        options           = {optionsToSelect}
                        styles={{
                            menuList : classes.menuList,
                            menu     : classes.menu
                        }}
                        isInvalid       = {isInvalid}
                        placeholderType = {placeholderType}
                    />
                </div>
                <div className={cx(styles.valuesContainer, classes.valuesContainer)}>
                    {
                        isValuesExist
                            ? <ValuesContainer
                                values={values}
                                onOrderChange={this.handleChangeOrder}
                                onValueDelete={this.handleValueDelete}
                            />
                            :  this.renderEmptyMessage()
                    }
                </div>
            </div>

        );
    };
}

export default SortableTopicsMultiSelect;

