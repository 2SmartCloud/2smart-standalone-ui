 ```js
const colorOprions = [{"value":"white","color":"#FFF"},{"value":"blue","color":"#D1EBFF"},{"value":"green","color":"#DBF9D6"},{"value":"yellow","color":"#FDF1B6"},{"value":"orange","color":"#FFE0BC"},{"value":"red","color":"#F9C2BA"},{"value":"violet","color":"#EAD0F4"},{"value":"light-blue","color":"#D8F3F9"},{"value":"light-green","color":"#E1FFEE"},{"value":"pink","color":"rgb(255, 235, 247)"},{"value":"dark-gray","color":"#D7DADF"},{"value":"light-gray","color":"#ECEDF0"}];

const customStyles = {
    placeholder : {
        fontSize  : '14px',
        textAlign : 'left'
    },
    singleValue : {
        color : '#1e1e1e',
        width : '93%'
    },
    option : {
        '&:hover' : { background: 'rgba(4, 192, 178, 0.05)' }
    }
};

<div style={{ maxWidth: '300px'}}>
    <ColorSelect
        options={colorOprions}
        placeholder='Select color'
        settings={{
            defaultValue : {"value":"light-blue","color":"#D8F3F9"},
            isSearchable : false
        }}
        darkThemeSupport
        styles={customStyles}
    />
</div>
```

