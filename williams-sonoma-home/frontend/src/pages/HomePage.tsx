import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      <Header />

      <main className="flex-grow">
        {/* Luxury Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/landing/hero.jpg" 
              alt="Luxury Living Space" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-5xl md:text-7xl mb-6 leading-tight uppercase tracking-widest font-serif">
              Williams Sonoma Home
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-normal opacity-90 tracking-wide max-w-2xl mx-auto">
              Elevating the art of the modern home through curated excellence and masterful craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => navigate('/catalog')}
                className="btn bg-white text-primary hover:bg-background px-10 py-4 transition-all"
              >
                Explore Collection
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="btn bg-transparent border border-white text-white hover:bg-white/10 px-10 py-4 transition-all"
              >
                Join the Collective
              </button>
            </div>
          </div>
        </section>

        {/* Narrative Section 1: The Art of Living */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl mb-8 leading-tight uppercase tracking-wider">
                The Art of Living
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Design is more than aesthetic; it is an experience. Our curated collections are hand-selected to create environments that inspire comfort, sophistication, and timeless elegance. Every piece in our catalog is a testament to the belief that your home should be a reflection of your finest self.
              </p>
              <button 
                onClick={() => navigate('/catalog')}
                className="text-secondary font-semibold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-primary hover:border-primary transition-all"
              >
                Discover the Catalog
              </button>
            </div>
            <div className="order-1 lg:order-2 h-[500px]">
              <img 
                src="/landing/feature1.webp" 
                alt="Sophisticated Interior" 
                className="w-full h-full object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Narrative Section 2: Precision & Craft */}
        <section className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="h-[500px]">
              <img 
                src="/landing/feature2.jpeg" 
                alt="Architectural Detail" 
                className="w-full h-full object-cover shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl mb-8 leading-tight uppercase tracking-wider">
                Masterful Engineering
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                By bridging the gap between designers and manufacturers, we ensure that every creation meets the highest standards of quality and durability. Our AI-driven insights empower artisans to refine their craft, resulting in furniture that is as technically sound as it is visually breathtaking.
              </p>
              <button 
                onClick={() => navigate('/catalog')}
                className="text-secondary font-semibold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-primary hover:border-primary transition-all"
              >
                View Craftsmanship
              </button>
            </div>
          </div>
        </section>

        {/* Premium Services Grid */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl uppercase tracking-widest mb-4">A Commitment to Excellence</h2>
              <div className="w-24 h-1 bg-secondary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-wider text-secondary">Curated Selection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every product is vetted by our global team of design experts to ensure unparalleled style and quality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-wider text-secondary">AI-Enhanced Design</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use advanced analytics and sentiment modeling to perfect our designs and minimize environmental waste.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 uppercase tracking-wider text-secondary">Global Logistics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our white-glove delivery service ensures your items arrive in pristine condition, anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary py-24 px-6 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl mb-8 uppercase tracking-widest font-serif italic">
              Experience the Future of Home
            </h2>
            <p className="text-xl mb-12 opacity-80 font-light tracking-wide leading-relaxed">
              Join our exclusive collective of designers, manufacturers, and homeowners shaping the spaces of tomorrow.
            </p>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-12 py-5 bg-white text-primary uppercase font-semibold tracking-widest hover:bg-background transition-all shadow-xl"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
