import { Button } from '@/components/ui/button';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import type { ApiResponse } from './types/api-response';
import { toast } from 'react-toastify';
import { showErrToast } from '@/lib/utils';
import { DEFAULT_INTERNAL_ERROR_MSG } from './constants';
import { useState } from 'react';
import { PAGE_PATHS } from '@/lib/paths';
type FormData = {
    username: string;
    password: string;
};

type ApiResponseData = {
    accessToken: string;
};

export default function Register() {
    const { register, reset, handleSubmit, formState } = useForm<FormData>();
    const navigate = useNavigate();
    const [err, setErr] = useState<string>('');

    const onSubmit = async (data: FormData) => {
        reset();
        setErr('');
        const res = await axios
            .post<ApiResponse<ApiResponseData>>('/api/v1/auth/signup', data)
            .catch((errResponse: AxiosError) => {
                const apiRes = errResponse.response
                    ?.data as ApiResponse<ApiResponseData>;
                if (!apiRes) {
                    showErrToast(DEFAULT_INTERNAL_ERROR_MSG);
                    return;
                }

                const statusCode = errResponse.response?.status!;
                const errorIsBadRequest = statusCode > 399 && statusCode < 500;

                if (errorIsBadRequest) {
                    const errMsg =
                        apiRes.errors.length > 0
                            ? apiRes.errors.reduce(
                                  (msg, err) => (msg += err),
                                  ''
                              )
                            : apiRes.message;
                    setErr(errMsg);
                } else {
                    showErrToast(DEFAULT_INTERNAL_ERROR_MSG);
                }
            });

        navigate(PAGE_PATHS.CHAT_PAGE, { replace: true });
        return;
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className=" h-2/5 w-4/7 max-w-sm rounded overflow-hidden shadow-lg bg-white rounded-2xl p-4 mt-45">
                <div className="mb-8 w-full">
                    <p className="text-center text-2xl">
                        Fill out the following to get started 🤓
                    </p>
                </div>
                <form
                    className="flex flex-col gap-4 p-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <p className="text-red-500">{err}</p>
                    </div>
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600">
                            Click here to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
