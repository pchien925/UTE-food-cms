import { sendRequest } from '@services/api';
import { useCallback, useEffect, useState } from 'react';
import apiUrl from '@constants/apiConfig';
import useIsMounted from './useIsMounted';

const useFetch = (apiConfig, { immediate = false, mappingData, mixinFuncs, params = {}, pathParams = {} } = {}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState({});
    const isMounted = useIsMounted();
    const execute = useCallback(
        async ({ onCompleted, onError, ...payload } = {}, cancelType) => {
            if (isMounted()) {
                setLoading(true);
                setError(null);
            }
            try {
                const { data, error } = await sendRequest(
                    apiConfig,
                    { params, pathParams, mixinFuncs, ...payload },
                    cancelType,
                );
                error && setErrorCode(error);
                if (!data?.result && data?.statusCode !== 200 && apiConfig.baseURL != apiUrl.auth.login.baseURL) {
                    throw data;
                }
                if (isMounted()) {
                    !cancelType && setData(mappingData ? mappingData(data) : data);
                }
                onCompleted && onCompleted(data);
                return data;
            } catch (err) {
                if (isMounted()) {
                    !cancelType && setError(err);
                }
                onError && onError(err);
                return errorCode;
            } finally {
                if (isMounted()) {
                    !cancelType && setLoading(false);
                }
            }
        },
        [apiConfig],
    );
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { loading, execute, data, error, setData };
};

export default useFetch;
