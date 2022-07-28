import {configureStore} from '@reduxjs/toolkit';
import { reducer } from './Slices/items.slice';

export const store= configureStore({
   reducer:{items:reducer} ,
   devTools:process.env.NODE_ENV!=='production',
});