import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { NavHeader } from '@/components/NavHeader';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Admin() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      setLocation('/');
    }
  }, [user, isAdmin, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader 
        onShowAuth={() => setShowAuthModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main>
        <AdminDashboard />
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
