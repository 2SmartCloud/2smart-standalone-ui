``` js
import { Provider } from 'react-redux';
import Button from '../Button.js';
import store from '../../../store/index.js';

const [isOpen, setIsOpen] = React.useState(false);
const [value, setValue] = React.useState('baseValue');
const handleOpenModal=()=>{
    setIsOpen(true);
}

const handleCloseModal=()=>{
    setIsOpen(false);
}

<Provider store={store}>
    <div>
        <div style={{ position:'relative', height:'500px'}}>
            <PincodeModal
                isCloseable
            />
        </div>
    </div>
</Provider>
```