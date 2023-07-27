### Base Item
```js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';
import history from '../../../history.js';
import { Router, Redirect } from 'react-router-dom';

const screen1 = {
    name:'Screen name',
    isActive:false,
    id:'#screenlistitem1',
    isParentControlEnabled:false
};

<div style={{width:'230px'}}>
    <Provider store={store}>
        <Router history={history}>
            <ScreenListItem
                screen={screen1}
                onClick={()=>{}}
            />
        </Router>
    </Provider>
</div>
```

### Active Item
```js
import { Provider } from 'react-redux';
import store from '../../../store/index.js';
import history from '../../../history.js';
import { Router, Redirect } from 'react-router-dom';

const screen2 = {
    name:'Screen name',
    isActive:true,
    id:'#screenlistitem2',
    isParentControlEnabled:false
};

<div style={{width:'230px'}}>
    <Provider store={store}>
        <Router history={history}>
            <ScreenListItem
                screen={screen2}
                onClick={()=>{}}
            />
        </Router>
    </Provider>
</div>
```

### With parent control
```js
import { Provider  } from 'react-redux';
import { useEffect } from 'react';
import { Router, Redirect } from 'react-router-dom';
import store from '../../../store/index.js';
import history  from '../../../history.js';
import {UPDATE_SETTING_SUCCESS} from '../../../../src/actions/user.js';
store.dispatch({
    type : UPDATE_SETTING_SUCCESS,
    key: 'isSecureModeEnabled',
    value: true
})


const screen3 = {
    name:'Screen name',
    isActive:false,
    id:'#screenlistitem3',
    isParentControlEnabled:true
};

<div style={{width:'230px'}}>
    <Provider store={store}>
        <Router history={history}>
            <ScreenListItem
                isClientPanelAccessGranted={false}
                screen={screen3}
                onClick={()=>{}}
            />
        </Router>
    </Provider>
</div>
```