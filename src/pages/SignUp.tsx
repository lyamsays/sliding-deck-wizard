
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignUpForm from '../components/auth/SignUpForm';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="max-w-md mx-auto">
          <SignUpForm />
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
