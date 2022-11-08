export const userManagementApi = {
    root: `/userAccess`,
    auth: `/api/userAccess`,
    tokenUrl: `/connect/token`,
    role: {
        root: `/api/userAccess/roles`
    },
    user: {
        root: `/api/userAccess/users`
    },
    permission: {
        root: `/api/users`
    },
    setting: {
        root: `/api/user-management/settings`
    }
};