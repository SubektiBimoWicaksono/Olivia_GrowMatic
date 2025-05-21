import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import axios, { AxiosError } from 'axios';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

// Type untuk form data
type FormData = {
  email: string;
  password: string;
};

// Type untuk error responses
type ErrorResponse = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Send login request to Laravel backend
      const response = await axios.post('http://localhost:8000/api/login', {
        email: formData.email,
        password: formData.password,
        remember: isChecked
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Store token and user data
      localStorage.setItem('auth_token', response.data.access_token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      navigate('/home');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      
      if (axiosError.response?.status === 422) {
        // Validation errors
        setErrors(axiosError.response.data.errors || {});
      } else if (axiosError.response?.status === 401) {
        // Invalid credentials
        setErrors({ general: 'Email atau password salah' });
      } else {
        // Other errors
        setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' });
        console.error('Login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to monitoring dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Growmatic Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access mushroom farm monitoring
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@farm.email"
                    error={errors.email?.[0]}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your secure password"
                      error={errors.password?.[0]}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.password[0]}
                    </p>
                  )}
                </div>
                
                {errors.general && (
                  <div className="p-3 text-sm text-center text-error-500 bg-error-50 rounded-lg">
                    {errors.general}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isChecked} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setIsChecked(e.target.checked)} 
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Remember this device
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button 
                    type="submit"
                    className="w-full" 
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Access My Mushroom Farm'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                New to Growmatic? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Create Farm Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}