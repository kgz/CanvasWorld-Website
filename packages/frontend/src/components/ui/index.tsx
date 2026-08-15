import React from 'react';
import { Link } from 'react-router-dom';

interface FractalCardProps {
  name: string;
  route: string;
  imageUrl: string;
  description?: string;
}

export const FractalCard: React.FC<FractalCardProps> = ({ name, route, imageUrl, description }) => {
  return (
    <Link to={route} className="group">
      <div className="fractal-card card-hover">
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium">{description || 'Explore this mathematical beauty'}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-400 text-sm">Mathematical Attractor</p>
        </div>
      </div>
    </Link>
  );
};

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full animate-float opacity-60" />
      <div className="absolute top-40 right-32 w-6 h-6 bg-purple-500 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-pink-500 rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="text-white">{title.split(' ')[0]} {title.split(' ')[1]} </span>
          <span className="gradient-text">{title.split(' ')[2]}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
            Explore Attractors
          </button>
          <button className="px-8 py-4 glass-effect text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/20">
            Learn More
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

interface GridSectionProps {
  children: React.ReactNode;
  title?: string;
}

export const GridSection: React.FC<GridSectionProps> = ({ children, title }) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {children}
        </div>
      </div>
    </section>
  );
};
