import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import BaseSelect               from '../select/BaseSelect';
import TopicSelect              from '../select/TopicSelect';
import Chip                     from '../Chip.js';
import ProcessingIndicator      from '../ProcessingIndicator.js';

import styles                   from './MultiSelect.less';

const cx = classnames.bind(styles);

const mapSelectTypeToComponent = {
    'topic' : TopicSelect,
    ''      : BaseSelect

};

class MultiSelect extends PureComponent {
    static propTypes = {
        options         : PropTypes.array.isRequired,
        isInvalid       : PropTypes.bool,
        onValueSelect   : PropTypes.func.isRequired,
        values          : PropTypes.array.isRequired,
        emptyMessages   : PropTypes.array,
        onValueDelete   : PropTypes.func,
        placeholder     : PropTypes.string,
        classes         : PropTypes.object,
        mobileTitle     : PropTypes.string,
        placeholderType : PropTypes.string,
        selectType      : PropTypes.string
    }

    static defaultProps ={
        classes         : {},
        isInvalid       : false,
        emptyMessages   : void 0,
        placeholder     : '',
        mobileTitle     : '',
        onValueDelete   : undefined,
        placeholderType : '',
        selectType      : ''
    };

    state = {
        isLoading : false
    }

    handleOptionAttach = async value => {
        this.setState({
            isLoading : true
        });
        try {
            await this.props.onValueSelect(value);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    handleValueDelete = async (value) => {
        const { onValueDelete } = this.props;

        this.setState({
            isLoading : true
        });

        try {
            if (onValueDelete) await onValueDelete(value);
        } finally {
            this.setState({
                isLoading : false
            });
        }
    }

    renderValues = () => {
        const { values, classes } = this.props;

        return (
            values.map(value => (
                <Chip
                    classes={classes}
                    key={value.id}
                    data={value}
                    onDeleteIconClick={this.handleValueDelete}
                />
            ))
        );
    }

    renderEmptyMessage = () => {
        const { emptyMessages } = this.props;

        if (!emptyMessages?.length) return null;

        return (
            <div className={styles.infoWrapper}>
                <div className={styles.infoLabel}>
                    { emptyMessages?.map((line, index) => (
                        <p key={index}> {/* eslint-disable-line react/no-array-index-key*/}
                            {line}
                        </p>
                    )) }
                </div>
            </div>
        );
    };

    render = () => {
        const { isLoading } = this.state;
        const { options, values, placeholder, classes,
            isInvalid, mobileTitle, placeholderType, selectType } = this.props;
        const isValuesExist = values?.length;
        const blurCN = cx(styles.blur, { isActive: isLoading });
        const Select = mapSelectTypeToComponent[selectType];

        return (
            <div className={cx(styles.MultiSelect, classes.selectWrapper)}>
                <div className={styles.select}>
                    <Select
                        {...this.props}
                        value             = ''
                        mobileTitle       = {mobileTitle}
                        blurInputOnSelect = {false}
                        maxMenuHeight     = {245}
                        placeholder       = {placeholder}
                        classNamePrefix   = 'multi'
                        onChange          = {this.handleOptionAttach}
                        options           = {options}
                        settings          = {{
                            isSearchable : true
                        }}
                        styles            = {{
                            ...(this.props?.styles || {}),
                            menuList : classes.menuList,
                            menu     : classes.menu
                        }}
                        classes           = {classes}
                        isInvalid         = {isInvalid}
                        darkThemeSupport
                        placeholderType   = {placeholderType}
                    />
                </div>
                <div
                    ref          = {node => this.values = node}
                    className    = {cx(styles.valuesContainer, classes.valuesContainer, {
                        notEmpty : isValuesExist
                    })}
                >
                    <div className={blurCN}>
                        { isValuesExist
                            ?  this.renderValues()
                            :  this.renderEmptyMessage()
                        }
                    </div>
                    {isLoading && <ProcessingIndicator className={styles.spinner} />}
                </div>

            </div>
        );
    };
}

export default MultiSelect;
