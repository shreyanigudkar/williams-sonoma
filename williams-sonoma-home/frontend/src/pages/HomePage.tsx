import React from 'react';
import { Header, Footer } from '../components/Layout';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-6xl mb-6 leading-tight">
            ELEVATE YOUR LIVING SPACE
          </h1>
          <p className="text-2xl mb-8 opacity-90">
            Discover curated luxury furniture for the modern home
          </p>
          <a href="/catalog" className="btn text-lg px-8 py-4 inline-block">
            EXPLORE CATALOG
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-serif text-xl mb-3">CURATED COLLECTION</h3>
            <p className="text-gray-700">
              Hand-selected designer furniture from the world's leading brands
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-serif text-xl mb-3">AI-POWERED INSIGHTS</h3>
            <p className="text-gray-700">
              Personalized recommendations based on your style and preferences
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-serif text-xl mb-3">PREMIUM SERVICE</h3>
            <p className="text-gray-700">
              White glove delivery and dedicated customer support
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-6">Ready to Transform Your Home?</h2>
          <p className="text-xl mb-8 opacity-90">Create an account to start shopping</p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="btn text-lg px-8 py-4 inline-block bg-white text-primary hover:bg-background">
              SIGN UP
            </a>
            <a href="/catalog" className="btn-secondary btn text-lg px-8 py-4 inline-block">
              BROWSE WITHOUT ACCOUNT
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
