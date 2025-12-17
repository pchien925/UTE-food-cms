import { useCallback,useState } from 'react';

const useUncontrolled = ({ value, defaultValue, onChange }) => {
    const [ state, setState ] = useState(value ?? defaultValue);

    const handleChange = useCallback(
        (newValue) => {
            if (onChange) {
                onChange(newValue);
            } else {
                setState(newValue);
            }
        },
        [ onChange ],
    );

    return [ value !== undefined ? value : state, handleChange ];
};

export default useUncontrolled;
