import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';
import '@testing-library/jest-dom';

const push = vi.fn();
const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace })
}));

vi.mock('@/components/feedback/toast-provider', () => ({
  useToast: () => ({ push })
}));

const submit = vi.fn(async () => ({ alias: 'admin', createdAt: new Date().toISOString() }));
vi.mock('@/features/auth/hooks', () => ({
  useLogin: () => ({ submit })
}));

describe('LoginForm', () => {
  it('envía credenciales y redirige al dashboard', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/alias/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/admin secret/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledWith({ alias: 'admin', secret: 'secret' });
      expect(replace).toHaveBeenCalledWith('/');
    });

    expect(push).toHaveBeenCalled();
  });
});
