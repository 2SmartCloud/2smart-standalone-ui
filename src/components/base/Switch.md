### Common
```js
const handleClick = () => {
    setState({
        checked: !state.checked
    })
};

<Switch
    checked={state.checked}
    onChange={handleClick}
    isProcessing={state.isProcessing}
/>
```


### Fetching
```js
const handleClick = () => {
    setState({
        isProcessing:true,
        checked: !state.checked
    })
   setTimeout(() => setState({isProcessing:false}), 2500);
};

<Switch
    checked={state.checked}
    onChange={handleClick}
    isProcessing={state.isProcessing}
/>
```

### Disabled
```js

<Switch
  disabled
/>
```