export type TUser = {
    profileUrl?: string;
    profileCache?: string;
    data?: {
        id?: string | number;
        username?: string;
        email?: string;
        updated_at?: string;
        last_login_attempt?: string;
    }
}