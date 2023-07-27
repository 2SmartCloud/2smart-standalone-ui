import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import CustomDatePickerItem from '../CustomDatePickerItem';

import styles from './CustomDatePicker.less';

const cn = classnames.bind(styles);

class CustomDatePicker extends PureComponent {
    static propTypes = {
        options   : PropTypes.array,
        active    : PropTypes.array,
        className : PropTypes.string,
        onChange  : PropTypes.func
    }

    static defaultProps = {
        options   : [],
        active    : [],
        className : '',
        onChange  : undefined
    }

    state = {
        downFlag : false,
        from     : null,
        next     : null,
        mask     : [
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0
        ]
    }

    // mask for style:
    // 0 - not active
    // 1 - single active
    // 2 - start range
    // 3 - in range
    // 4 - end range

    componentDidMount() {
        const { active } = this.props;

        if (active.length) {
            this.createDefaultRange(active);
        }
    }

    componentDidUpdate(prevProps) {
        const { active } = this.props;

        if (active.length !== prevProps.active.length) {
            this.createDefaultRange(active);
        }
    }

    handleChange = (index) => {
        const { mask, from } = this.state;
        const newMask = [ ...mask ];

        if (!this.isClick) {
            this.dateItemNotClicked(newMask, newMask[index], index);
            newMask[index] = 1;

            this.setState({
                mask : newMask,
                from : index
            });

            return;
        }

        if (this.isClick) {
            this.isClick = false;
            this.dateItemIsClicked(index, from);
        }
    }

    handleMouseEnter = (index) => {
        const { from, mask } = this.state;

        if (this.isClick) {
            const newMask = [ ...mask ];

            if (index < from) return;
            if (from !== index) {
                newMask[index] = 3;
                this.setState({ next: index, prev: index - 1 });
                this.createHoveredRange(from, index);

                return;
            }
            if (newMask[index] === 2) {
                newMask[index + 1] === 0;
                this.setState({ mask: newMask });
            }
        }

        return;
    }

    handleMouseLeave = (index) => {
        const { from, next, mask } = this.state;

        if (this.isClick) {
            if (index < from) return;
            if (from === index) {
                const newMask = [ ...mask ];

                newMask[index] = 2;
                this.setState({ mask: newMask, prev: next - 1 });

                return;
            }
            if (next > from) {
                this.removeHoveredRange(index, from);
                this.clearRange(mask, index, 1);

                return;
            }
        }
    }

    createHoveredRange = (from, to) => {
        const { mask } = this.state;
        const newMask = [ ...mask ];

        // eslint-disable-next-line more/no-c-like-loops
        for (let i = from; i <= to; i++) {
            newMask[from] = 2;
            newMask[i] = 3;
        }

        this.setState({ mask: newMask });
    }

    removeHoveredRange = (from, to) => {
        const { mask } = this.state;
        const newMask = mask;

        // eslint-disable-next-line more/no-c-like-loops
        for (let i = from; i >= to; i--) {
            mask[i] = 0;
            mask[to] = 2;
        }
        this.setState({ mask: newMask });
    }

    clearRange = (arr, index, direction) => {
        const { next } = this.state;
        const newArray = arr;
        let i = index;
        let condition = true;

        const edge = direction === 1 ? 4 : 2;

        while (arr[index] !== edge && condition) {
            i += direction;
            if (newArray[i]) {
                if (newArray[i + 1] === 2) {
                    newArray[i + 1] = 2;

                    this.setState({ mask: newArray });
                }
                if (newArray[i - 1] === 4) condition = false;
                newArray[i] = 0;

                this.setState({ mask: newArray });
                if (newArray[next] === 2) break;
            } else {
                break;
            }
        }
    }

    createRangeOfSelectedValues = () => {
        const { onChange } = this.props;
        const { mask } = this.state;

        if (!onChange) return;

        const arr = mask.map((item, index) => {
            if (item !== 0) return `${index + 1}`;

            return item;
        }).filter(item => item !== 0);

        onChange(arr);
    }

    dateItemNotClicked = (mask, value, index) => {
        this.isClick = true;

        if (value === 3) {
            this.clearRange(mask, index, -1);
            this.clearRange(mask, index, 1);
        }
        if (value === 2) {
            this.clearRange(mask, index, 1);
        }
        if (value === 4) {
            this.clearRange(mask, index, -1);
        }
    }

    dateItemIsClicked = (index, from) => {
        const { mask } = this.state;
        const newMask = [ ...mask ];

        if (index < from) {
            newMask[from] = 1;
            this.setState({
                mask : newMask,
                prev : null,
                from : null,
                next : null
            });
            this.createRangeOfSelectedValues();

            return;
        }
        if (index === from) {
            newMask[index] = 1;
            this.setState({
                mask : newMask,
                prev : null,
                from : null,
                next : null
            });
            this.createRangeOfSelectedValues();

            return;
        }
        if (newMask[index + 1] === 3) {
            newMask[index + 1] = 2;
            this.setState({
                mask : newMask
            });
        }
        if (newMask[index + 1] === 4) {
            newMask[index + 1] = 1;
            this.setState({
                mask : newMask
            });
        }

        newMask[index] = 4;
        this.setState({
            mask : newMask,
            prev : null,
            from : null,
            next : null
        });
        this.createRangeOfSelectedValues();
    }

    createDefaultRange = (active = []) => {
        if (!active.length) return;

        const { mask } = this.state;
        const activeArrayInt = active.map(item => +item);
        const newMask = [ ...mask ];
        const maskToSet = [];

        activeArrayInt.forEach(item => newMask[item - 1] = item);
        newMask.forEach((item, index) => {
            const isPrevIndexInRange = newMask[index - 1] === 3;
            const isNextIndexNotActive = newMask[index + 1] === 0;
            const isPrevIndexStartRange = newMask[index - 1] === 2;
            const isLastIndex = index === newMask.length - 1;
            const isPrevIndexNotActive = newMask[index - 1] === 0;
            const isNextIndexInRange = newMask[index + 1] === 3;

            const isEndRange = (isPrevIndexInRange && isNextIndexNotActive)
                || (isPrevIndexStartRange && isNextIndexNotActive)
                || (isPrevIndexInRange && isLastIndex)
                || (isPrevIndexStartRange && isLastIndex);
            const isRange = isPrevIndexStartRange || isPrevIndexInRange;
            const isSingle = isPrevIndexNotActive && isNextIndexNotActive
                || (isNextIndexNotActive && !!(newMask[index]))
                || isLastIndex;
            const isStartRange = !isNextIndexNotActive || isNextIndexInRange;

            if (item !== 0) {
                switch (true) {
                    case isEndRange:
                        newMask[index] = 4;
                        maskToSet.push(4);
                        break;
                    case isRange:
                        newMask[index] = 3;
                        maskToSet.push(3);
                        break;
                    case isSingle:
                        newMask[index] = 1;
                        maskToSet.push(1);
                        break;
                    case isStartRange:
                        newMask[index] = 2;
                        maskToSet.push(2);
                        break;
                    default:
                        break;
                }

                return;
            }
            newMask[index] = 0;
            maskToSet.push(0);
        });
        this.setState({ mask: maskToSet });
    }

    render() {
        const { options, className } = this.props;
        const { mask } = this.state;
        const CustomDatePickerCN = cn({
            CustomDatePicker,
            [className] : className
        });

        return (
            <div className={CustomDatePickerCN}>
                { options.map((item, index) => {
                    const isValueNotActive = mask[index] === 0;
                    const isValueSingle = mask[index] === 1;
                    const isValueStartRange = mask[index] === 2;
                    const isValueInRange = mask[index] === 3;
                    const isValueEndRage = mask[index] === 4;

                    return (
                        <CustomDatePickerItem
                            key={item.id}
                            index={index}
                            label={item.label}
                            isNotActive={isValueNotActive}
                            isSingle={isValueSingle}
                            isStartRange={isValueStartRange}
                            isRange={isValueInRange}
                            isEndRange={isValueEndRage}
                            onClick={this.handleChange}
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                        />
                    );
                })}
            </div>
        );
    }
}

export default CustomDatePicker;
