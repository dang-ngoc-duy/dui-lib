import { makeStyles } from '@mui/styles';

const buttonStyle = makeStyles(() => ({
	root: {
        padding: '0.5rem',
        background: '#f4f4f4',
        border: '1px solid #323330',
        color: '#323330',
        transition: '0.3s ease-in-out',

        '&:hover, &:active': {
            background: 'white',
        },
        '&:hover': {
            boxShadow: '0px 0px 5px 1px rgb(50, 51, 48, 0.1)',
        },
        '&:active': {
            boxShadow: 'inset 0px 0px 5px 1px rgb(50, 51, 48, 0.1)',
        },
        /* btnType */
        '&.primary': {
            background: '#24a0ed',
            border: '1px solid #24a0ed',
            color: 'white',
        },
        '&.secondary': {
            background: 'white',
            border: '1px solid #24a0ed',
            color: '#24a0ed',
        },
        '&.ghost': {
            border: '1px solid #f4f4f4',
            color: 'gray',
        },
        /* button size */
        '&.button-lg': {
            width: '10rem',
            fontSize: '1rem',
        },
        '&.button-md': {
            width: '8rem',
            fontSize: '0.8rem',
        },
        '&.button-sm': {
            width: '6rem',
            fontSize: '0.5rem',
        },
        /* rounded button */
        '&.button-soft': {
            borderRadius: '0.2rem',
        },
        '&.button-hard': {
            borderRadius: '0.4rem',
        },
        /* active state when isActive === true */
        '&.active': {
            fontWeight: '600',
        },
        /* disabled state when isDisabled === true */
        '&.disabled': {
            background: 'white',
            border: 'solid 0.5px lightgray',
            color: 'lightgray',
            cursor: 'not-allowed',
            boxShadow: 'none',
        },
	},
})) as Function;

export default buttonStyle;
