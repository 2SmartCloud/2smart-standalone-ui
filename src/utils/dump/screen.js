import uuidv4 from 'uuid/v4';
import { mapWidget } from '../mapper/widget';

export function dumpScreens(screens) {
    return screens.map(dumpScreen);
}

export function dumpScreen(screen) {
    const { widgets = [], parentControl: isParentControlEnabled } = screen;

    delete screen.parentControl;

    return {
        ...screen,
        isParentControlEnabled,
        widgets : widgets.map(widget => ({ ...mapWidget(widget), id: widget.id.toString() })),
        uuid    : uuidv4()
    };
}
