import React, { Component }        from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'react-redux';
import classnames                  from 'classnames/bind';
import { Close }                   from '@material-ui/icons';
import IconButton                  from '@material-ui/core/IconButton';
import Tooltip                     from '@material-ui/core/Tooltip';

import globalEnterHandler          from '../../../utils/globalEnterHandler';
import { getEntitiesTreeByTopics } from '../../../utils/homie/getEntities';
import { sortEntitiesByType }      from '../../../utils/sort';
import Search                      from '../../base/inputs/Search';
import FolderIcon                  from '../icons/Folder';
import ArrowRightIcon              from '../icons/arrows/ArrowRight';
import ThresholdIcon               from '../icons/Threshold';
import ScenarioIcon                from '../icons/Scenario';
import GroupsIcon                  from '../icons/GroupsEntity';
import GroupIcon                   from '../icons/GroupEntity';
import ScenariosIcon               from '../icons/Scenarios';
import ThresholdsIcon              from '../icons/Thresholds';
import PulsIcon                    from '../icons/Puls';
import TachometerIcon              from '../icons/Tachometer';
import WiFiTowerIcon               from '../icons/WifiTower';
import GearIcon                    from '../icons/Gear';
import EntitiesEmptyList           from '../nothingToShowNotification/Entities';
import Modal                       from '../Modal';
import Button                      from '../Button';
import CriticalValue               from '../CriticalValue';

import styles                      from './EntityModal.less';

const cx = classnames.bind(styles);

const ICONS_BY_TYPE = {
    scenarios  : ScenariosIcon,
    thresholds : ThresholdsIcon,
    device     : WiFiTowerIcon,
    groups     : GroupsIcon,

    node      : FolderIcon,
    options   : GearIcon,
    telemetry : TachometerIcon,
    scenario  : ScenarioIcon,
    group     : GroupIcon,

    nodeoptions   : GearIcon,
    nodetelemetry : TachometerIcon,
    nodesensors   : PulsIcon,
    threshold     : ThresholdIcon
};

const uriDelimeter = '#';

class EntityModal extends Component {
    static propTypes = {
        isOpen       : PropTypes.bool.isRequired,
        onClose      : PropTypes.func.isRequired,
        onSubmit     : PropTypes.func.isRequired,
        data         : PropTypes.shape({}),
        selectedData : PropTypes.shape({}),
        multiple     : PropTypes.bool
    }

    static defaultProps = {
        data         : {},
        selectedData : null,
        multiple     : false
    }

    constructor(props) {
        super(props);

        const { selectedData } = props;
        let initialSelected = '';

        if (selectedData) {
            const keys = Object.keys(selectedData || {});
            const firstKey = keys?.length ? keys[0] : '';
            const children = selectedData[firstKey]?.children || {};
            const childrenKeys = Object.keys(children || {});
            const firstChildKey = childrenKeys[0] || '';
            const lastChildrenKeys = Object.keys(children?.[firstChildKey]?.children || {});

            if (keys.length) {
                initialSelected = [ firstKey, firstChildKey, lastChildrenKeys ? lastChildrenKeys[0] : '' ].join('#');
            }
        }

        this.state = {
            currentOpened    : initialSelected,
            selected         : initialSelected ? [ initialSelected ] : [],
            search           : '',
            isSearchPriority : false
        };
    }

    componentDidMount() {
        globalEnterHandler.register(this.handleEnterPressed);

        this.scrollToSelectedElements();
    }

    componentWillUnmount() {
        if (this.syncTimeout) clearTimeout(this.syncTimeout);
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleEnterPressed = () => {
        this.handleFormSubmit();
    }

    handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        const { selected } = this.state;
        const { onSubmit, multiple } = this.props;

        if (!selected?.length) return;

        const values = selected.map(this.getValueByOptionUri);

        onSubmit(multiple ? values : values[0]);
    }

    handleChangeSearch = (search) => {
        function leftrim(str) {
            if (!str) return str;

            return str.replace(/^\s+/g, '');
        }

        this.setState({
            search           : leftrim(search),
            isSearchPriority : true
        }, () => {
            this.scrollToSelectedElements();
        });
    }

    handleSelectOption = (selectedId, uri) => {
        return () => {
            const { multiple } = this.props;
            const { currentOpened, selected } = this.state;

            if (!uri || (!multiple && currentOpened === uri)) return;

            let updatedSelected = [ ...selected ];

            if (this.getValueByOptionUri(uri)) {
                if (multiple) {
                    const isOptionSelected = updatedSelected?.some(optionUri => optionUri === uri);

                    // check/uncheck option
                    if (isOptionSelected) {
                        updatedSelected = updatedSelected.filter(optionUri => optionUri !== uri);
                    } else {
                        updatedSelected.push(uri);
                    }
                } else {
                    updatedSelected = [ uri ];
                }
            }

            this.setState({
                currentOpened    : uri,
                selected         : updatedSelected,
                isSearchPriority : false
            }, () => {
                if (this.submitButtonRef && updatedSelected.length) this.submitButtonRef?.focus();
            });
        };
    }

    getFilteredDataBySearch = () => {
        const { data } = this.props;
        const { search, isSearchPriority } = this.state;

        if (!search) return data;

        function isMetaBySearch(list = []) {
            return list.some(element => ((element || '')?.toLowerCase() || '')
                ?.includes(search?.toLowerCase() || '') || false);
        }

        function getValidNodes(nodes) {
            const processNodes = {};
            const nodesKeys = Object?.keys(nodes || {});

            if (!nodesKeys?.length) return processNodes;

            nodesKeys.forEach((key) => {
                const nodeData = nodes[key];
                const isNodeValid = isMetaBySearch(nodeData?.searchMeta);

                if (isNodeValid) {
                    processNodes[key] = nodeData;
                } else if (nodeData?.children) {
                    const nestedChildren = getValidNodes(nodeData?.children);

                    if (Object.keys(nestedChildren || {})?.length) {
                        processNodes[key] = {
                            ...nodeData,
                            children : nestedChildren
                        };
                    }
                }
            });

            return processNodes;
        }

        const validData = getValidNodes(data);

        if (isSearchPriority) {
            // auto select entities by seacrh value if isSearchPriority === true
            const firstColumnKeys       = Object.keys(validData || {}) || [];
            const firstColumnFirstNode  = validData?.[firstColumnKeys[0]];
            const secondColumnKeys      = Object.keys(firstColumnFirstNode?.children || {}) || [];
            const secondColumnFirstNode = firstColumnFirstNode?.children?.[secondColumnKeys[0]];
            const lastColumnKeys        = Object.keys(secondColumnFirstNode?.children || {}) || [];
            const lastColumnFirstNode   = secondColumnFirstNode?.children?.[lastColumnKeys[0]];

            const isChangeSelected = firstColumnKeys?.length === 1 && secondColumnKeys?.length === 1;

            if (isChangeSelected) {
                const selectedToSet = [
                    firstColumnFirstNode?.info?.id,
                    secondColumnFirstNode?.info?.id,
                    ...lastColumnKeys?.length === 1 ? [ lastColumnFirstNode?.info?.id ] : []
                ];

                this.syncSelectedWithSearch(selectedToSet.join(uriDelimeter));
            } else if (firstColumnKeys?.length === 1) {
                this.syncSelectedWithSearch(firstColumnFirstNode?.info?.id);
            }
        }

        return validData;
    }

    setSubmitButtonRef = node => this.submitButtonRef = node;

    getValueByOptionUri = optionUri => {
        const { data } = this.props;

        const [ first, second, last ] = optionUri.split(uriDelimeter);
        const isAllSelected = first && second && last;

        const selectedEntity = isAllSelected
            ? data?.[first]?.children?.[second]?.children?.[last]
            : data?.[first]?.children?.[second];

        return selectedEntity?.value || null;
    }

    scrollToSelectedElements = () => {
        const { currentOpened } = this.state;

        this.scrollTimeout = setTimeout(() => {
            const selectedElements = [
                document.getElementById(currentOpened?.split(uriDelimeter)[0]),
                document.getElementById(currentOpened?.split(uriDelimeter)?.slice(0, 2).join(uriDelimeter)),
                document.getElementById(currentOpened)
            ];

            selectedElements.forEach(elem => {
                if (!elem) return;

                elem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }, 300);
    }

    syncSelectedWithSearch = optionUriToSet => {
        this.syncTimeout = setTimeout(() => {
            const { selected } = this.state;
            const isValidSelectedOption =
                !selected.some(optionUri => optionUri === optionUriToSet) &&
                this.getValueByOptionUri(optionUriToSet);

            this.setState({
                currentOpened : optionUriToSet,
                selected      : isValidSelectedOption ? [ ...selected, optionUriToSet ] : selected
            });
        }, 100);
    }

    renderOption = ({ type, label, isSelected, isHighlighted, id, withChildren = false, isActive, topic, uri = '' } = {}) => {
        const Icon = ICONS_BY_TYPE[type];
        const icon = (
            <div className={styles.iconWrapper}>
                { Icon ? <Icon /> : null }
            </div>
        );

        return (
            <div
                className={cx(styles.optionWrapper, {
                    selected    : isSelected,
                    highlighted : isHighlighted,
                    disabled    : !isActive,
                    withChildren
                })}
                id      = {uri}
                onClick = {this.handleSelectOption(id, uri)}
                key     = {id}
            >
                { !!topic
                    ? (
                        <Tooltip
                            title       = {topic}
                            classes     = {{
                                tooltip : styles.tooltip
                            }}
                        >
                            {icon}
                        </Tooltip>
                    ) : icon
                }
                <div className={styles.labelWrapper}>
                    <CriticalValue
                        value       = {label}
                        className   = {styles.label}
                        fontWeight  = {isSelected ? '500' : '300'}
                        interactive = {false}
                    />
                </div>
                { withChildren
                    ? (
                        <div className={styles.arrowWrapper}>
                            <ArrowRightIcon />
                        </div>
                    ) : null
                }
            </div>
        );
    }

    renderFirstColumn = (data) => {
        const { selected, currentOpened } = this.state;
        const keys    = Object?.keys(data || {});
        const isEmpty = !keys?.length;

        const sortedList = sortEntitiesByType(
            keys?.map(key => ({
                ...data[key],
                label : data[key]?.info?.title || data[key]?.info?.name
            })),
            [ 'activeDevice', 'inactiveDevice', 'scenarios', 'thresholds', 'groups' ]
        );

        return (
            <div className={cx(styles.optionsWrapper, { empty: isEmpty })}>
                { sortedList?.map(entityData => {
                    const optionUri = entityData?.info?.id;
                    const isSelected = selected?.some(selectedUri => selectedUri.split(uriDelimeter)[0] === optionUri);
                    const isHighlighted = currentOpened.split(uriDelimeter)[0] === optionUri;

                    return this.renderOption({
                        label        : entityData?.label,
                        id           : entityData?.info?.id,
                        uri          : optionUri,
                        type         : entityData?.type,
                        isActive     : entityData?.isActive,
                        withChildren : !!Object.keys(entityData?.children || {})?.length || false,
                        isSelected,
                        isHighlighted
                    });
                })}
            </div>
        );
    }

    renderSecondColumn = (data) => {
        const { currentOpened, selected } = this.state;

        const [ parentId ]   = currentOpened?.split(uriDelimeter);
        const entities       = data?.[parentId]?.children || {};
        const entititiesKeys = Object?.keys(entities || []);
        const isEmpty        = !entititiesKeys?.length;

        const sortedList = sortEntitiesByType(
            entititiesKeys?.map(key => ({
                ...entities[key],
                label : entities[key]?.info?.title || entities[key]?.info?.name
            })),
            [ 'scenarios', 'thresholds' ]?.includes(parentId) ? [] : [ 'node', 'options', 'telemetry' ],
            true
        );

        return (
            <div className={cx(styles.optionsWrapper, { empty: isEmpty })}>
                { sortedList?.map(entityData => {
                    const optionUri = [ parentId, entityData?.info?.id ].join(uriDelimeter);
                    const isSelected = selected?.some(selectedUri =>
                        selectedUri.split(uriDelimeter).slice(0, 2).join(uriDelimeter) === optionUri
                    );
                    const isHighlighted = currentOpened
                        .split(uriDelimeter).slice(0, 2)
                        .join(uriDelimeter) === optionUri;

                    return this.renderOption({
                        label        : entityData?.label,
                        id           : entityData?.info?.id,
                        uri          : optionUri,
                        isActive     : entityData?.isActive,
                        type         : entityData?.type,
                        topic        : entityData?.value?.topic || '',
                        withChildren : !!Object.keys(entityData?.children || {})?.length || false,
                        isSelected,
                        isHighlighted
                    });
                })}
            </div>
        );
    }

    renderLastColumn = (data) => {
        const { currentOpened, selected } = this.state;
        const [ firstId, secondId ] = currentOpened?.split('#');

        const entities       = data?.[firstId]?.children?.[secondId]?.children || {};
        const entititiesKeys = Object?.keys(entities || []);
        const isEmpty        = !entititiesKeys?.length;

        const sortedList = sortEntitiesByType(
            entititiesKeys?.map(key => ({
                ...entities[key],
                label : entities[key]?.info?.title || entities[key]?.info?.name
            })),
            [ 'scenarios', 'thresholds' ]?.includes(firstId) ? [ 'scenario', 'threshold' ] : [ 'nodesensors', 'nodeoptions', 'nodetelemetry' ],
            true
        );

        return (
            <div className={cx(styles.optionsWrapper, { empty: isEmpty })}>
                { sortedList?.map(entityData => {
                    const optionUri = [ firstId, secondId, entityData?.info?.id ].join(uriDelimeter);
                    const isSelected = selected?.some(selectedUri => selectedUri === optionUri);
                    const isHighlighted = currentOpened === optionUri;

                    const aliasName  = entityData?.alias?.name;
                    const label      = `${entityData?.label} ${aliasName ? `(${aliasName})` : ''}`;

                    return this.renderOption({
                        label,
                        id       : entityData?.info?.id,
                        uri      : optionUri,
                        isActive : entityData?.isActive,
                        type     : entityData?.type,
                        topic    : entityData?.value?.topic || '',
                        isSelected,
                        isHighlighted
                    });
                })}
            </div>
        );
    }

    render() {
        const { isOpen, multiple, onClose, data = {} } = this.props;
        const { search, selected } = this.state;
        const isFormValid = !!selected?.length;

        const isEmpty = !Object.keys(data || {})?.length;
        const filteredData = isEmpty ? {} : this.getFilteredDataBySearch(data);
        const isFilteredEmpty = !Object.keys(filteredData || {})?.length;

        return (
            <Modal
                isOpen    = {isOpen}
                onClose   = {onClose}
                className = {styles.modal}
            >
                <div className={styles.container}>
                    <IconButton
                        className = {styles.closeButton}
                        onClick   = {onClose}
                        disableFocusRipple
                        disableRipple
                    >
                        <Close />
                    </IconButton>
                    <div className={styles.heading}>
                        <h1 className={styles.header}>
                            {multiple ? 'Select entities' : 'Select entity'}
                        </h1>
                        <div className={cx(styles.searchWrapper, { hidden: isEmpty })}>
                            <Search
                                placeholder     = {'Search'}
                                placeholderType = 'secondary'
                                value           = {search}
                                onChange        = {this.handleChangeSearch}
                            />
                        </div>
                    </div>
                    <div className={styles.form}>
                        <div className={styles.content}>
                            <div className={cx(styles.entities, { empty: isEmpty || isFilteredEmpty })}>
                                { isEmpty || isFilteredEmpty
                                    ? (
                                        <div className={styles.emptyListWrapper}>
                                            <EntitiesEmptyList isSeacrh={!!search} />
                                        </div>
                                    ) : (
                                        <div className={styles.scrollBlock}>
                                            <div className={styles.box}>
                                                {this.renderFirstColumn(filteredData)}
                                            </div>
                                            <div className={styles.box}>
                                                {this.renderSecondColumn(filteredData)}
                                            </div>
                                            <div className={styles.box}>
                                                {this.renderLastColumn(filteredData)}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <Button
                                type       = 'button'
                                text       = 'Cancel'
                                onClick    = {onClose}
                                isDisabled = {false}
                            />
                            <Button
                                type       = 'submit'
                                text       = {selected.length > 1 ? 'Add entities' : 'Add entity'}
                                onClick    = {this.handleFormSubmit}
                                setRef     = {this.setSubmitButtonRef}
                                isDisabled = {!isFormValid}
                                isFetching = {false}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { topics, selected } = ownProps;

    const data = getEntitiesTreeByTopics(topics);
    const selectedData = selected ? getEntitiesTreeByTopics([ selected ]) : null;

    return {
        data,
        selectedData
    };
}

export default connect(mapStateToProps, null)(EntityModal);
