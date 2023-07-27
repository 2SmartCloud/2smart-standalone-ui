export const dispatch = jest.fn();

export async function actionTestRunner(actionCreator, ...args) {
    return await actionCreator(...args)(dispatch);
}
