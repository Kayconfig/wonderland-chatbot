import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { PAGE_PATHS } from '@/lib/paths';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import ErrorPage from './Error';
import { useAuth } from '@/providers/auth-provider';
type FormData = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const { register, reset, handleSubmit, formState } = useForm<FormData>();
    const [loading, setLoading] = useState(true);
    const [errOccurred, setErrorOccurred] = useState(false);
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(true);
    const authCtx = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        authCtx
            .isAuthenticated()
            .then((userHasActiveSession) =>
                setUserIsLoggedIn(userHasActiveSession)
            )
            .catch(() => setErrorOccurred(true))
            .finally(() => setLoading(false));
    }, []);
    const onSubmit = async (data: FormData) => {
        reset();
        try {
            // on success, cookies should be set
            await axios.post('/api/v1/auth/signin', data);
            navigate(PAGE_PATHS.CHAT_PAGE);
        } catch (err) {
            if (err instanceof AxiosError) {
                const errMsg =
                    err.response?.data?.errors?.[0] ||
                    err.response?.data?.message;
                alert(errMsg);
            }
            console.error({ errorToDebug: err });
        }
    };

    if (loading) return <Loading />;

    if (errOccurred) return <ErrorPage />;

    if (userIsLoggedIn) navigate(PAGE_PATHS.CHAT_PAGE);
    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className=" h-2/5 w-4/7 max-w-sm rounded overflow-hidden shadow-lg bg-white rounded-2xl p-4 mt-45">
                <div className="mb-8 w-full">
                    <p className="text-center text-2xl">
                        Welcome, Enter your login credentials
                    </p>
                </div>
                <form
                    className="flex flex-col gap-4 p-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label className="" htmlFor="username">
                            Username:
                        </label>
                        <input
                            {...register('username', {
                                required: true,
                                validate: (username) =>
                                    username.trim().length > 3 &&
                                    username.trim().length <= 25,
                            })}
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            type="text"
                            className="w-full h-10 border-1 p-3"
                        />
                    </div>

                    <div>
                        <label className="" htmlFor="password">
                            Password:
                        </label>
                        <input
                            {...register('password', {
                                required: true,
                                validate: (password) =>
                                    password.trim().length >= 8 &&
                                    password.trim().length <= 100,
                            })}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            className="w-full h-10 border-1 p-3"
                        />
                    </div>
                    <Button
                        disabled={!formState.isValid || formState.isLoading}
                    >
                        {formState.isLoading ? 'please wait...' : 'Submit'}
                    </Button>
                </form>
                <div>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500">
                            Click here to get started
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
