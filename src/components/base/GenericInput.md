### Common
```js
import getPropertyUnit from '../../utils/getPropertyUnit';
const [value, setValue] = React.useState('Input value');

const handleSubmit= ({value}) => {
    setValue(value);
};
    
<div style={{maxWidth:'300px'}}>
    <GenericInput
        type='string'
        value={value}
        unit={getPropertyUnit('Unit')}
        isSettable={true}
        onSubmit={handleSubmit}
        isTransparent
        darkThemeSupport
        isSync
        baseControlClassName='InputWidget'
    />
</div>
```

### Overflowed
```js
import getPropertyUnit from '../../utils/getPropertyUnit';
const [value, setValue] = React.useState('Long innnnnppppppopuuuuut vaaaaalllllllluuuuuuueeeeeeeee');

const handleSubmit= ({value}) => {
    setValue(value);
};
    

<div style={{maxWidth:'300px'}}>
    <GenericInput
        type='string'
        value={value}
        unit={getPropertyUnit('Unnnnniiiiiiiiit')}
        onSubmit={handleSubmit}
        isSettable={true}
        isTransparent
        darkThemeSupport
        isSync
        baseControlClassName='InputWidget'
    />
</div>

```