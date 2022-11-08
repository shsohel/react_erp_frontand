
import permissions from '@src/views/auth/permission/store/reducers';
import roles from '@src/views/auth/role/store/reducers';
import users from '@src/views/auth/user/store/reducers';
import auth from './auth';
import fileProgress from './file-progress';
import layout from './layout';
import navbar from './navbar';

export const authReducer = {
    auth,
    roles,
    users,
    permissions,
    navbar,
    layout,
    fileProgress
};