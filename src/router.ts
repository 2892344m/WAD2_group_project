import { Hono, Env } from 'hono';

import * as dashboard from './routes/Dashboard/dashboard';
import * as library from './routes/Dashboard/library';
import * as home from './routes/home';
import * as bookingDetails from './routes/Dashboard/bookingDetails';
import * as itemDetails from './routes/Dashboard/itemDetails';
import * as itemsIndex from './routes/Dashboard/itemsIndex';
import * as usersIndex from './routes/Dashboard/usersIndex';
import * as userDetails from './routes/Dashboard/userDetails';
import * as login from './routes/login';
import * as signup from './routes/signup';
import * as logout from './routes/logout';
import * as forgotPassword from './routes/forgotPassword';
import * as resetPassword from './routes/resetPassword';
import * as bookingsIndex from './routes/Dashboard/BookingsIndex';
import * as userHistory from './routes/Dashboard/userHistory';

import * as addNewItemIndex from './routes/Dashboard/AddNewItemIndex';
import * as editItem from './routes/Dashboard/EditItem';
import * as itemHistory from './routes/Dashboard/itemHistory';

import * as profileIndex from './routes/Dashboard/ProfileIndex';

import * as requestsIndex from './routes/Dashboard/RequestsIndex';

export const loadRoutes = <T extends Env>(app: Hono<T>) => {
  app.get('/dashboard', dashboard.onRequestGet);

  app.get('/library', library.onRequestGet);
  app.post('/library', library.onRequestPost);

  app.get('/dashboard/items/:itemID', itemDetails.onRequestGet);
  app.post('/dashboard/items/:itemID', itemDetails.onRequestPost);
  app.get('/dashboard/items', itemsIndex.onRequestGet);

  app.get('/dashboard/users/:uid', userDetails.onRequestGet);
  //app.post('/dashboard/users/:uid/promote', userDetails.onRequestPost);
  //app.post('/dashboard/users/:uid/demote', userDetails.onRequestPostDemote);
  app.get('/dashboard/users', usersIndex.onRequestGet);

  app.get('/dashboard/bookings/:bookingID', bookingDetails.onRequestGet);
  app.get('/dashboard/bookings', bookingsIndex.onRequestGet);

  app.get('/dashboard/addNewItem', addNewItemIndex.onRequestGet);
  app.post('/dashboard/addNewItem', addNewItemIndex.onRequestPost);

  app.get('/dashboard/items/:itemID/edit', editItem.onRequestGet);
  app.post('/dashboard/items/:itemID/edit', editItem.onRequestPost);

  app.get('/dashboard/profile', profileIndex.onRequestGet);

  app.get('/dashboard/requests', requestsIndex.onRequestGet);
  app.post('/dashboard/requests', requestsIndex.onRequestPost);

  app.get('/login', login.onRequestGet);
  app.post('/login', login.onRequestPost);

  app.get('/signup', signup.onRequestGet);
  app.post('/signup', signup.onRequestPost);

  app.get('/forgot-password', forgotPassword.onRequestGet);
  app.post('/forgot-password', forgotPassword.onRequestPost);

  app.get('/reset-password', resetPassword.onRequestGet);
  app.post('/reset-password', resetPassword.onRequestPost);

  app.get('/logout', logout.onRequestGet);

  app.get('/', home.onRequestGet);

  app.get('/dashboard/items/:itemID/history', itemHistory.onRequestGet);
};