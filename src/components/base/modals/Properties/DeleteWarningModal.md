``` js
import { Provider } from 'react-redux';
import Button from '../../Button.js';
import store from '../../../../store/index.js';

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
        <Button
            text='Open modal'
            onClick={handleOpenModal}
            autoFocus={true}
        />

        <DeleteWarningModal
            hardwareType={'node'}
            deleteHardware={()=>{}}
            name='Thermometer'
            isOpen={isOpen}
            handleModalClose={handleCloseModal}
            deviceId={'fat'}
            nodeId={'thermometer'}
        />
    </div>
</Provider>
```