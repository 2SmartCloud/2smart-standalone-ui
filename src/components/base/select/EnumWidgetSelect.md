```js
const options=[{"value":"ON","label":"ON"},{"value":"OFF","label":"OFF"},{"value":"BOOL","label":"BOOL"},{"value":"NUM","label":"NUM"},{"value":"STR","label":"STR"},{"value":"COOL","label":"COOL"},{"value":"LONG-LONG-TEXT-TEXT-EVEN","label":"LONG-LONG-TEXT-TEXT-EVEN"},{"value":"ASJDNASDJASKDJKLAJSLDKJASLKJDKLASJKLDJSKLAJD","label":"ASJDNASDJASKDJKLAJSLDKJASLKJDKLASJKLDJSKLAJD"}];

const [value, setValue] = React.useState('ON');
const handleChangeValue = ({value}) => {
    setValue(value);
};


<div style={{ maxWidth: '300px'}}>
    <EnumWidgetSelect
        value={value}
        onChange={handleChangeValue}
        darkThemeSupport
        options={options}
    />
</div>
```