### Base button
```js 
<Button
    text='Base'
    type='submit'
    autoFocus
/>
```


### Fetching
```js
const handleClick = () => {
        setState({ isFetching: true });
        setTimeout(() => setState({ isFetching: false }), 1500);
    };

<div>
    <Button
        text='Click me'
        type='submit'
        isFetching={state.isFetching}
        onClick={handleClick}
        autoFocus
    />
</div>
```


### Negative button
```js 
<Button
    text='Delete'
    type='submit'
    autoFocus
    isNegative
/>
```


### Disabled button
```js 
<Button
    text='Disabled'
    type='submit'
    isDisabled
    autoFocus
/>
```

