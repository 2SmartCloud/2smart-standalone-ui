import { WIDGETS_MAP } from '../../assets/constants/widget';

export function mapWidget(widget) {
    const { topics = [], advanced, type,  ...restFields } = widget;
    const isMulti = !!WIDGETS_MAP[type]?.isMulti;

    return  isMulti
        ? {
            isMulti,
            type,
            ...restFields,
            topics,
            advanced : { ...advanced }
        }
        : {
            isMulti,
            type,
            ...restFields,
            topic    : topics[0],
            advanced : { ...advanced }
        };
}

// export function mapTopic({ topicName, ...restFields }) {
//     return {
//         label : topicName,
//         ...restFields
//     };
// }
// export function mapSingleTopic({ topicName,  ...restFields } = {}) {
//     return {
//         label : topicName,
//         ...restFields
//     };
// }

// function comparator(a, b) {
//     if (a.order < b.order) {
//         return -1;
//     }
//     if (a.order > b.order) {
//         return 1;
//     }

//     return 0;
// }
