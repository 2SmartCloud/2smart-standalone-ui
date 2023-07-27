import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import Tooltip                  from '@material-ui/core/Tooltip';
import ClearIcon                from '@material-ui/icons/Clear';
import styles                   from './Chip.less';

const cx = classnames.bind(styles);

class Chip extends PureComponent {
    static propTypes = {
        data              : PropTypes.object.isRequired,
        onDeleteIconClick : PropTypes.func,
        classes           : PropTypes.shape({
            chipRoot  : PropTypes.string,
            chipLabel : PropTypes.string
        }),
        disabled      : PropTypes.bool,
        onClick       : PropTypes.func,
        renderTooltip : PropTypes.func,
        withTooltip   : PropTypes.bool,
        size          : PropTypes.oneOf([ 'S', 'M' ]),
        color         : PropTypes.oneOf([ 'primary', 'secondary' ])
    }
    static defaultProps = {
        classes           : { },
        onDeleteIconClick : null,
        disabled          : false,
        onClick           : null,
        size              : 'M',
        withTooltip       : true,
        renderTooltip     : void 0,
        color             : 'primary'
    }

    handleUnattach= () => {
        const { data } = this.props;

        this.props.onDeleteIconClick(data);
    }

    handleClick = () => {
        const { onClick, disabled } = this.props;

        if (onClick && !disabled) onClick();
    }

    render = () => {
        const {
            data,
            classes,
            onDeleteIconClick,
            disabled,
            onClick,
            size,
            withTooltip,
            color,
            renderTooltip
        } = this.props;
        const { id, label, deleted = false } = data;
        const chipCN = cx(styles.Chip, classes.chipRoot, {
            deleted,
            disabled,
            hoverable       : !!onClick && !disabled,
            [`size${size}`] : size,
            [color]         : color
        });

        return (
            <div key={id} className={chipCN} onClick={this.handleClick}>
                { withTooltip
                    ? (
                        <Tooltip
                            key       = {id}
                            placement = 'bottom-start'
                            classes   = {{
                                tooltip : styles.tooltip
                            }}
                            title={renderTooltip ? renderTooltip(data) : label}
                        >
                            <p className={cx(styles.label, classes.chipLabel)}>{label}</p>
                        </Tooltip>
                    ) :  <p className={cx(styles.label, classes.chipLabel)}>{label}</p>
                }
                { onDeleteIconClick
                    ? (
                        <ClearIcon
                            onClick  = {this.handleUnattach}
                            classes  = {{ root: styles.icon }}
                            fontSize = 'small'
                        />
                    ) : null
                }
            </div>
        );
    };
}

export default Chip;
