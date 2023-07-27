export const sliderStyles = {
    root : {
        color      : '#04c0b2',
        height     : 8,
        transition : 'all 0.3s',
        padding    : '21px 0 10px'
    },
    disabled : {},
    thumb    : {
        height                     : '20px !important',
        width                      : '20px !important',
        backgroundColor            : '#FFF',
        border                     : '2px solid currentColor',
        marginTop                  : '-5px !important',
        marginLeft                 : '-10px !important',
        '&:hover,&:active,&:focus' : {
            boxShadow : '0px 0px 0px 2px var(--color_picker_knob_shadow)'
        }
    },
    active     : {},
    valueLabel : {
        left       : '-50% !important',
        transform  : 'none !important',
        top        : -22,
        background : 'rgba(4,192,178, 0.1)',
        '& *'      : {
            color        : '#000',
            transform    : 'rotate(0)',
            height       : '20px',
            minWidth     : '30px',
            width        : 'auto',
            padding      : '0 5px',
            lineHeight   : '20px',
            borderRadius : '4px',
            textAlign    : 'center'
        },
        '& > span' : {
            background : 'rgba(4,192,178, 0.3)'

        },
        '& span' : {
            padding : '0 1px !important'
        }
    },
    track : {
        height       : 8,
        borderRadius : 4
    },
    rail : {
        height       : 8,
        borderRadius : 4
    }
};
