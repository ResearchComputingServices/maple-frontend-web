'use client';
import { signIn } from 'next-auth/react';
import { Row, Col, Card, Form, Image, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from "next/navigation";

export default Login;

function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/config";

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    const fields = {
        username: register('username', { required: 'Username is required' }),
        password: register('password', { required: 'Password is required' })
    };

    async function onSubmit({ username, password }: any) {
        try {
            const response: any = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });
            if (!response?.error) {
                router.push('/config');
                router.refresh();
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Process response here
            console.log('Login Successful', response);
        } catch (error: any) {
            console.error('Login Failed:', error);
        }
    }

    return (
        <div>
            <Row className="align-items-center justify-content-center g-0 min-vh-100">

                <Col xxl={4} lg={4} md={4} xs={12} className="py-8 py-xl-0">
                    <Card className="smooth-shadow-md">
                        <Card.Header className="p-4">
                            <div className="mb-2 text-center">
                                <Link href="/"><Image src="/images/brand/logo/carleton-logo-login.png" className="mb-2" alt="" /></Link>
                            </div>
                        </Card.Header>

                        <Card.Body className="p-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <input {...fields.username} type="text" placeholder="Enter address here" className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.username?.message?.toString()}</div>
                                </div>

                                <div className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <input {...fields.password} type="password" placeholder="**************" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.password?.message?.toString()}</div>
                                </div>

                                <div>
                                    {/* Button */}
                                    <div className="d-grid">
                                        <button className="btn btn-primary" disabled={formState.isSubmitting}>
                                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                                            Sign In
                                        </button>
                                        <div className="d-md-flex justify-content-between mt-4">
                                            <div className="mb-2 mb-md-0">
                                                <Link href="/" className="fs-5">Cancel </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
