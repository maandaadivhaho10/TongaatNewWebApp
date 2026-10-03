import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const NAVY = '#201E64';

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  error,
  trailing
}) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={!!error}
          className={[
            'peer w-full h-14 rounded-full border bg-white pl-5 pt-4 text-sm text-neutral-900 outline-none transition',
            trailing ? 'pr-12' : 'pr-5',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-neutral-300 hover:border-neutral-400 focus:border-[#201E64] focus:ring-2 focus:ring-[#201E64]/15',
          ].join(' ')}
        />

        <label
          htmlFor={id}
          className={[
            'pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-neutral-500 transition-all duration-150',
            'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px]',
            'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]',
          ].join(' ')}
        >
          {label}
        </label>

        {trailing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 ml-5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.9 6.8-16.9z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.5 2.2-8.8 2.2-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = {};

    if (!identifier.trim()) {
      next.identifier = 'Enter your email or phone number';
    }

    if (!password) {
      next.password = 'Enter your password';
    }

    setErrors(next);

    if (Object.keys(next).length > 0) return;

    console.log('Log in:', {
      identifier,
      staySignedIn,
    });
  };

 return (
  <div className="min-h-screen bg-[#F5F6FA] text-neutral-900">

    <div className="min-h-screen flex">

      {/* =====================================================
          LEFT BRANDING PANEL
      ===================================================== */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#201E64] relative overflow-hidden">

        {/* Decorative background shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

          {/* Logo */}
          <div>
            <div className="inline-flex items-center justify-center bg-white rounded-2xl px-8 py-6 shadow-lg">
              <img
                src="/Ngabadi-Foods-logo.png"
                alt="Tongaat Hulett"
                className="w-[280px] xl:w-[320px] h-auto"
                draggable="false"
              />
            </div>
          </div>

          {/* Main branding message */}
          <div className="max-w-md text-white">

            <div className="w-12 h-1 bg-white/80 rounded-full mb-7" />

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Empowering businesses.
              <br />
              Growing communities.
            </h2>

            <p className="mt-6 text-base xl:text-lg text-white/75 leading-relaxed">
              Access your Tongaat Hulett business support platform
              and manage your opportunities, applications and
              business activities in one place.
            </p>

          </div>

          {/* Footer */}
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} Tongaat Hulett
          </div>

        </div>
      </div>


      {/* =====================================================
          RIGHT LOGIN SECTION
      ===================================================== */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">

        <div className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">

            <div className="bg-white rounded-2xl px-7 py-5 shadow-sm border border-neutral-200">
              <img
                src="/Tongaat-Huletts-Logo.png"
                alt="Tongaat Hulett"
                className="w-[220px] h-auto"
                draggable="false"
              />
            </div>

          </div>


          {/* Login card */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-7 sm:p-10">

          <div className="mb-8 text-center">

  <h1
    className="text-3xl font-bold tracking-tight"
    style={{ color: NAVY }}
  >
    Welcome Back!
  </h1>

  <p className="mt-2 text-sm text-neutral-500">
    Sign in to your account to continue.
  </p>

</div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >

              <FloatingInput
                id="identifier"
                label="Email or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                error={errors.identifier}
              />


              <FloatingInput
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                error={errors.password}
                trailing={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((s) => !s)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="p-2 rounded-full text-neutral-600 hover:text-[#201E64] hover:bg-neutral-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                }
              />


              {/* Options */}
              <div className="flex items-center justify-between px-1">

                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">

                  <input
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={(e) =>
                      setStaySignedIn(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-neutral-400 accent-[#201E64] cursor-pointer"
                  />

                  <span className="text-xs text-neutral-600">
                    Stay signed in
                  </span>

                </label>


                <button
                  type="button"
                  className="text-xs font-medium text-[#201E64] hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
                >
                  Forgot Password?
                </button>

              </div>


              {/* Login button */}
              <button
                type="submit"
                onClick={() =>
                  navigate('/dashboard')
                }
                className="w-full h-12 rounded-full text-white text-sm font-semibold shadow-sm transition-all duration-200 bg-[#201E64] hover:bg-[#2B2889] hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
              >
                Log In
              </button>

            </form>


            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <span className="flex-1 h-px bg-neutral-200" />

              <span className="text-[11px] font-medium text-neutral-400">
                OR
              </span>

              <span className="flex-1 h-px bg-neutral-200" />

            </div>


            {/* Google */}
            <button
              type="button"
              className="w-full h-12 inline-flex items-center justify-center gap-3 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 text-sm font-medium text-neutral-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64] focus-visible:ring-offset-2"
            >

              <GoogleIcon />

              <span>
                Continue with Google
              </span>

            </button>


            {/* Register */}
            <p className="mt-8 text-center text-sm text-neutral-500">

              Don&apos;t have an account?{' '}

              <button
                type="button"
                onClick={() =>
                  navigate('/select-user-type')
                }
                className="font-semibold text-[#201E64] hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201E64]"
              >
                Register
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
)
}