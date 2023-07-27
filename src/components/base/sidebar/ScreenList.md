```js
import { Provider } from 'react-redux';
import { Router, Redirect } from 'react-router-dom';
import store from '../../../store/index.js';
import history from '../../../history.js';

const screens= [
    {
        name:'Screen  1',
        id:'#screenlistitem/1',
        isActive:true,
        isParentControlEnabled:false
    },
    {
        name:'Screen 2',
        id:'#screenlistitem/2',
        isParentControlEnabled:false
    },
    {
        name:'Screen 3',
        id:'#screenlistitem/3',
        isParentControlEnabled:false
    }
];


const [state, setState] = React.useState(screens);

handleSelectScreen = id => {
        const newState = state.map(
            screen=> screen.id===id ? {...screen,isActive:true} : {...screen,isActive:false}
        ) 

        setState(newState);
    }


<Provider store={store}>
    <Router history={history}>
    <div style={{width:'230px'}}>
        <ScreenList screens={state}  onScreenSelect={handleSelectScreen} />
    </div>
    </Router>
</Provider>
```