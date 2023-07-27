```js
import { Provider } from 'react-redux';
import store from '../../store/index.js';
import meta from '../../components/base/toast/meta';
import {
    callToastNotification,
    hideToastNotification,
    callValErrNotification
} from '../../actions/interface';
import Button from './Button.js';

import 'react-toastify/dist/ReactToastify.css';

const handleBaseClick  =()=>{
    store.dispatch(
        callToastNotification({
            meta: meta.UPDATE_OPTION,
            title: 'Done',
            message: 'Your setting successfully updated'
        })
    );
}

const handleCookieDisabledlick =()=>{
    store.dispatch(
        callToastNotification({ 
            meta    : meta.COOKIES_DISABLED,
            title   : 'Something went wrong',
            message : 'Seems that cookies are disabled.'
        })
    );
    store.dispatch(
        hideToastNotification(meta.COOKIES_DISABLED)
    );
};


const handleBadResponselick =()=>{
    store.dispatch(
        callToastNotification({ 
            meta    : meta.BAD_RESPONSE,
            title   : 'Something went wrong',
            message : 'Bad response from server'
        })
    );
    store.dispatch(
        hideToastNotification(meta.BAD_RESPONSE)
    ); 
};


const handleConnectionErrorClick = () => {
    store.dispatch(
        callToastNotification({ 
            meta    : meta.GO_OFFLINE,
            title   : 'Something went wrong',
            message : 'Seems that connection with your network is lost. Please, try to establish connection.'
        })
    );
    store.dispatch(
        hideToastNotification(meta.GO_OFFLINE)
    );
};

const handleValidationErrorClick = () => {
    store.dispatch(
        callValErrNotification({
            meta: 'BROKER_RESPONSE_TIMEOUT',
            title: 'Network error',
            message: 'Something went wrong. Please try again'
        })
    )
}

<Provider store={store}>
    <ToastNotification />
    <div style={{paddingBottom:'20px'}}>
        <Button
            text='Change setting notification'
            onClick={handleBaseClick}
            autoFocus
        />
    </div>

    <div style={{paddingBottom:'20px' }}>
        <Button
            text='Cookie disabled'
            onClick={handleCookieDisabledlick}
            autoFocus
        />
    </div>

    <div style={{paddingBottom:'20px'}}>
        <Button
            text='Bad response'
            onClick={handleBadResponselick}
            autoFocus
        />
    </div>

    <div style={{paddingBottom:'20px'}}>
        <Button
            text='Connection error'
            onClick={handleConnectionErrorClick}
            autoFocus
        />
    </div>
        <div style={{paddingBottom:'20px'}}>
        <Button
            text='Validation error'
            onClick={handleValidationErrorClick}
            autoFocus
        />
    </div>
</Provider>
```
