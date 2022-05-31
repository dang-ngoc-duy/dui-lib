import { makeStyles } from '@mui/styles';

const doughnutChartStyle = makeStyles(() => ({
	root: {
		height: '100%',
		width: '100%',
        position: 'relative',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        '& label': {
            position: 'absolute',
            right: 113,
            top: 24,
            // fontSize: '15px',
            // color: '#333',
            // fontWeight: 'normal'
        },
        '& .legend-container': {
            position: 'absolute',
            right: 113,
            top: 24,
            // fontSize: '15px',
            // color: '#333',
            // fontWeight: 'normal'
        },
        
        '& .top-bottom': {
            '& ul': {
                padding: 0,
                listStyle: 'none',
                '& li': {
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: '0.5rem',
                    padding: '0 !important',
                    height: '30px',
                    marginBottom: '6px'
                },
                '& .withValue':{
                    marginBottom: '40px'
                },
            },
            
            '& .legend-top': {
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    // color: '#353535',
                    '&:before': {
                        content: '" ■ "',
                        fontSize: '25px',
                    },
                    '& label': {
                        position: 'unset',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                }
            },
            '& .no-title': {
                '&::before':{
                    content: 'unset',
                    position: 'unset',
                    left: 'unset' ,
                    transform: 'unset',
                    color: 'unset'
                }
            },

            '& .legend-bottom': {
                position: 'relative',
                '&>ul':{
                    marginTop: '20px',
                },
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    // color: '#353535',
                    '&::before': {
                        content: '"■"',
                        //transform: 'translateY(-0.65em)',
                        fontSize: '33px',
                        //verticalAlign: 'middle',
                        marginRight: '5px',
                        // display:"inline-block",
                        width: '33px',
                    },
                    '& label': {
                        position: 'unset',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                        // display:'inline-block',
                        transform: 'translateY(-2px)'
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&::before':{
                    content: '"Ghi chú:"',
                    position: 'absolute',
                    transform: 'translate(-4.5rem, 1.10em)',
                    color: 'var(--mscb-primary)',
                    fontSize: '16px',
                },
            },
            '& .emptyNote':{
                '&::before':{
                 display: 'none'
                } 
            }
        },
        '& .left-right': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            overflow: 'hidden',
            height: '-webkit-fill-available',
            '& ul': {
                padding: 0,
                listStyle: 'none',
                '& li': {
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '0px',
                    padding: '5px',
                }
            },

            '& .legend-left': {
                maxWidth: '400px',
                // minWidth: '400px',
                minWidth: 'max(0px, min(400px, calc((29vw - 500px) * 9999)))',
                textAlign: 'right',
                // marginRight: '40px',
                paddingRight: '18px',
                overflow: 'auto',
                height: '-webkit-fill-available',
                color: '#d5d5d5',

                '&>ul':{
                    direction: 'ltr',
                    height: '-webkit-fill-available',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                },
                
                '& ul>li>.value': {
                    color: '#33375D',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'right',
                    right: 0,
                    marginRight: '-18px'
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:after': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.55em)',
                        fontSize: '33px',
                        top: '0'
                    },
                    '& label': {
                        position: 'relative',
                        top: 0,
                        right: '0.2em',
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary)'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&  ul>li>.shortLegend':{
                    '&:after': {
                        transform: 'translateY(-0.3rem) !important',

                    }, 
                },

                '&::-webkit-scrollbar':{
                    width: '26px',
                    borderRadius: '13px',
                    backgroundClip: 'padding-box',
                    border: '10px solid transparent',
                },

                '&::-webkit-scrollbar-thumb': {    
                    width: '26px',
                    borderRadius: '13px',
                    backgroundClip: 'padding-box',
                    border: '10px solid transparent',
                    boxShadow: 'inset 0 0 0 10px',
                }
            },
            '& .legend-full-right': {
                maxWidth: '400px',
                // minWidth: 'max(0px, min(400px, calc((100% - 500px) * 9999)))',
                minWidth: 'max(0px, min(400px, calc((29vw - 500px) * 9999)))',
                textAlign: 'left',
                overflow: 'auto',
                height: '-webkit-fill-available',
                direction: 'rtl',
                color: '#d5d5d5',
                
                '&>ul':{
                    direction: 'ltr',
                    height: '-webkit-fill-available',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                },
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    color: '#33375D',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:before': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.55em)',
                        fontSize: '33px',
                    },
                    '& label': {
                        position: 'relative',
                        marginLeft: '1.5em',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&  ul>li>.shortLegend':{
                    '&:before': {
                        transform: 'translateY(-0.3rem) !important',

                    }, 
                },

                '&::-webkit-scrollbar':{
                    width: '26px',
                    borderRadius: '13px',
                    backgroundClip: 'padding-box',
                    border: '10px solid transparent',
                },

                '&::-webkit-scrollbar-thumb': {    
                    width: '26px',
                    borderRadius: '13px',
                    backgroundClip: 'padding-box',
                    border: '10px solid transparent',
                    boxShadow: 'inset 0 0 0 10px',
                }
            },
            '& .legend-right': {
                maxWidth: '400px',
                minWidth: 'max(0px, min(400px, calc((100% - 535px) * 9999)))',
                textAlign: 'left',
                marginRight:'2em',
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:before': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.55em)',
                        fontSize: '33px',
                    },
                    '& label': {
                        position: 'relative',
                        marginLeft: '1.5em',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&  ul>li>.shortLegend':{
                    '&:before': {
                        transform: 'translateY(-0.3rem) !important',

                    }, 
                }
            },
        },
        '& .one-side':{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            '& ul': {
                padding: 0,
                listStyle: 'none',
                '& li': {
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '10px',
                    padding: '5px',
                }
            },
            '& .legend-left': {
                maxWidth: '400px',
                minWidth: '400px',
                textAlign: 'right',
                // marginRight: '40px',
                paddingRight: '18px',
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'right',
                    right: 0,
                    marginRight: '-18px'
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:after': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.55em)',
                        fontSize: '33px',
                        top: '0'
                    },
                    '& label': {
                        position: 'relative',
                        top: 0,
                        right: '0.2em',
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&  ul>li>.shortLegend':{
                    '&:after': {
                        transform: 'translateY(-0.3rem) !important',

                    }, 
                }
            },
            '& .legend-full-right': {
                maxWidth: '400px',
                minWidth: 'max(0px, min(400px, calc((100% - 500px) * 9999)))',
                textAlign: 'left',
              
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:before': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.55em)',
                        fontSize: '33px',
                    },
                    '& label': {
                        position: 'relative',
                        marginLeft: '1.5em',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
                '&  ul>li>.shortLegend':{
                    '&:before': {
                        transform: 'translateY(-0.3rem) !important',

                    }, 
                }
            },
            '& .legend-right': {
                maxWidth: '400px',
                // minWidth: 'max(0px, min(400px, calc((100% - 535px) * 9999)))',
                textAlign: 'left',
                marginRight:'2em',
                '& ul>li>.value': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontStretch: 'normal',
                    fontStyle: 'normal',
                    lineHeight: '1.22',
                    letterSpacing: 'normal',
                    textAlign: 'left',
                    // color: '#353535'
                },
                '& ul>li>.name': {
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'block',
                    marginTop: '5px',
                    position: 'relative',
                    // color: '#353535',
                    '&:before': {
                        content: '" ■ "',
                        position: 'absolute',
                        transform: 'translateY(-0.3rem)',
                        fontSize: '33px',
                    },
                    '& label': {
                        position: 'relative',
                        marginLeft: '1.5em',
                        top: 0,
                        right: 0,
                        color: 'black',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    },
                    '& label.active': {
                        color: 'var(--mscb-primary) !important'
                    },
                    '& label:hover': {
                        color: 'var(--mscb-primary)'
                    }
                },
            },
        },
        '& .chart-center': {
            '& .chart-base': {
            },
            position: 'relative',
            //left:"-4%",
            '& .total': {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                
                '& label': {
                    color: 'rgb(115,115,115)',
                    top: 'unset',
                    right: 'unset',
                    position: 'unset',
                }
            },
            '& .empty': {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                
                '& label': {
                    color: 'rgb(115,115,115)',
                    top: 'unset',
                    right: 'unset',
                    position: 'unset',
                }
            }
        }
	},
})) as Function;

export default doughnutChartStyle;
