import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ProcessingIndicator from '../../ProcessingIndicator';
import BaseOption from './BaseOption';

import styles from './LoadingOption.less';

class LoadingOption extends PureComponent {
    state = {
        isSelected : false
    }

    getInnerProps = () => {
        const { innerProps: { onClick, ...innerProps }, data } = this.props;
        const prop = {
            ...innerProps,
            onClick : async () => {
                this.setState({
                    isSelected : true
                });

                try {
                    await onClick(data);
                    this.setState({
                        isSelected : false
                    });
                } catch (err) {
                    this.setState({
                        isSelected : false
                    });
                }
            }
        };

        return prop;
    }

    render() {
        const { label  } = this.props;
        const { isSelected }  = this.state;

        return (
            <BaseOption
                {...this.props}
                innerProps={this.getInnerProps()}
                isSelected={isSelected}
            >
                <Fragment>
                    <div className={styles.LoadingOption}>{label}</div>
                    {isSelected &&  <ProcessingIndicator  className = {styles.spinner} />}
                </Fragment>
            </BaseOption>
        );
    }
}

LoadingOption.propTypes = {
    data       : PropTypes.object.isRequired,
    innerProps : PropTypes.object.isRequired,
    label      : PropTypes.string
};

LoadingOption.defaultProps = {
    label : ''
};

export default LoadingOption;

