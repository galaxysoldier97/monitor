import React, {createContext, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

//Find more information about this stepper in the readme.
const StepperContext = createContext();

const StepperProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [width, setWidth] = useState('sm');
    const [error, setError] = useState('');

    const handleClose = () => {
        setOpen(false);
        setPage(0);
        setWidth('sm');
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const nextPage = () => {
        setPage(page + 1);
    };

    const previousPage = () => {
        setPage( page - 1);
    };

    useEffect(() => {
        if(page === 0){
            setWidth('sm');
        }
    }, [page]);
    const contextValue = { open, page, width, setWidth, error, setError, handleClose, handleOpen, nextPage, previousPage };

    return (
        <StepperContext.Provider value={contextValue}>
            {children}
        </StepperContext.Provider>
    );
};

const useStepper = () => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error('useStepper must be used inside of StepperProvider');
    }
    return context;
};

export { StepperProvider, useStepper };

StepperProvider.propTypes = {
    children: PropTypes.node,
};
