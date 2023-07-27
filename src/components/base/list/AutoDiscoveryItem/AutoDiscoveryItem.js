import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { formatDate }           from '../../../../utils/date';
import Button                   from '../../../base/Button';
import Icon                     from '../../Icon';
import styles                   from './styles.less';


class AutoDiscoveryItem extends PureComponent {
    static propTypes = {
        device            : PropTypes.object.isRequired,
        onDeleteIconClick : PropTypes.func.isRequired,
        onAcceptClick     : PropTypes.func.isRequired
    }

    state = {
        isNewButtonDisable : false
    }

    handleAddDevice = async () => {
        const { onAcceptClick, device : { entityTopic, deviceId } } = this.props;

        onAcceptClick(entityTopic, deviceId);
    }

    getStatusControl=(status) => {
        switch (status) {
            case 'isNew':
            case 'isFetching':  {
                return (
                    <Button
                        text       = 'Add'
                        className  = {styles.addButton}
                        onClick    = {this.handleAddDevice}
                        isFetching = {status === 'isFetching'}
                    />
                );
            }
            case 'isPending':  {
                return (<Icon type='pending-clock' />);
            }

            default:  {
                break;
            }
        }
    }
    render() {
        const { device: { name, status, createdAt }, onDeleteIconClick } = this.props;

        return (
            <div className= {styles.AutoDiscovery} >
                <div className={styles.description}>
                    <div className={styles.deviceName} >
                        {name}
                    </div>
                    { createdAt
                        ? (
                            <div className={styles.time} >
                                {formatDate({ date: createdAt })}
                            </div>
                        ) : null
                    }
                </div>
                <div className={styles.buttonsWrapper}>
                    { this.getStatusControl(status) }
                    <Button
                        text      = 'Decline'
                        className = {styles.declineButton}
                        onClick   = {onDeleteIconClick}
                        isNegative
                    />
                </div>
            </div>
        );
    }
}


export default AutoDiscoveryItem;

