export  function getOptions(defaultOption, optionsArray) {
    const options = [ ...optionsArray ];
    const isSelectedValueNotPresent = defaultOption
     && !optionsArray.find(option => option.value === defaultOption.value);

    if (isSelectedValueNotPresent) {
        options.unshift({ ...defaultOption, disabled: true });
    } else if (defaultOption) {
        options.sort((a, b) => {
            if (a.value === defaultOption.value) return -1;
            if (b.value === defaultOption.value) return 1;
        });
    }

    return options;
}

export  function getOptionByValue(value, options) {
    const returnedOption =  options.find(option => option.value === value);

    return returnedOption || ({ id: value, label: value, topic: value, withTitle: false, isDeleted: true });
}

export function checkIsValueDeleted(selectedValues = [], optionsArray = [], parametr = 'id') {
    const withDeleteOptions = selectedValues.map(
        (value, index) => {
            if (typeof value === 'string') {
                const topicObject = optionsArray.find(option => option.topic === value);

                return topicObject
                    ? { id: value, topic: value, label: value, ...topicObject, order: index }
                    : { topic: value, id: value, label: value, order: index, deleted: true };
            }

            const topicObject = optionsArray.find(option => option[parametr] === value[parametr]);

            return (topicObject === undefined
                ? { ...value, topic: value?.topic || value?.id, deleted: true }
                : { ...value, topic: topicObject?.topic || topicObject?.id, label: topicObject.label });
        }
    );

    return withDeleteOptions;
}

export  function getSortedOptionsByTitle(optionsArray) {
    return optionsArray && [ ...optionsArray ].sort(compareByTitle);
}

function compareByTitle({ label: aLabel }, { label: bLabel }) {
    return aLabel.toLowerCase() > bLabel.toLowerCase() ? 1 : -1;
}
