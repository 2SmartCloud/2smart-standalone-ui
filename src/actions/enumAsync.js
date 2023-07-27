/* eslint-disable more/prefer-includes */
import api from '../apiSingleton';

export function getEnumAsyncOptions(path, params) {
    return async () => {
        try {
            const data = await api.enumAsync.list(path, params);

            return data;
        } catch (err) {
            console.log(err);
        }
    };
}
