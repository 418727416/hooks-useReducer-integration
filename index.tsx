import React, { Context, FC, ComponentClass, createContext, useContext, useReducer, Dispatch } from 'react';
/** 
 * @createContext ProviderContext 一个创建完毕的context
*/
const ProviderContext: Context<any> = createContext('provider');
/** 高阶函数
 *  @param reducer 传入一个整合或者没有整合的reducer
 *  @param initialState 传入一个初始化的state，用来当做默认值
 */
export default (reducer: Function, initialState: any, init?: any) => (Com: FC<any> | ComponentClass<any, any>) => {
    return () => {
        const [state, dispatch] = useReducer<any>(reducer, initialState, init);
        return (
            <ProviderContext.Provider value={{ state, dispatch }}>
                <Com />
            </ProviderContext.Provider >
        );
    }
}
/**
 *      获取自定义的redux
 *  @state 这个参数是需要拿来使用的state 
 *  @dispatch 这个参数是dispatch分发action使用的
 *  @T 接收一个state的类型，是总体的state的类型
 */
export function useCustomRedux<T>() {
    interface Type {
        dispatch: Dispatch<T>;
        state: T;
    }
    return useContext<Type>(ProviderContext);
}
/**接受一个包含多个reducer函数的对象，返回一个新的reducer函数
 * @param reducers 传入多个reducer,用于整合成一个reducer
 */
export function combineReducers(reducers: any) {//整合reducer函数的对象的函数
    return function (state = {}, action: any) {//返回一个整合之后的reducer函数 ,然后传给了createStore使用
        //依次调用所有的reduce函数，并得到了状态,然后得到了许多的状态,得到n个新的子状态，封装成对象并返回
        return Object.keys(reducers).reduce((newState: any, key: string | number) => {
            try {
                newState[key] = reducers[key]((state as any)[key], action);//然后得到新的子状态，赋值给对应的key的新state里面
            } catch (error) {
                console.error('传入的state的key必须和每个reducer的key一致');
            }
            return newState;
        }, {});
    }
}