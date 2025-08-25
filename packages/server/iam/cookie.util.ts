export const cookieUtil = {
    createAuthCookie(accessToken: string) {
        return { authToken: accessToken };
    },
};
