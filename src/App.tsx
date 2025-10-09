import { useState, useEffect } from 'react';
import { MedicalFormWizard } from './components/medical-form-wizard';
import type { FormData } from './components/medical-form-wizard';
import { ProfileView } from './components/profile-view';
import { AlertsDashboard } from './components/alerts-dashboard';
import { store } from './store';
import { Button } from './components/ui/button';

export default function App() {
  const [view, setView] = useState<'registro' | 'perfil' | 'alertas'>('registro');

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2">
          <h1 className="font-semibold text-blue-700 flex-1">Historial Médico Digital</h1>
          <Button variant={view==='registro' ? 'default' : 'outline'} onClick={() => setView('registro')}>Registro</Button>
          <Button variant={view==='perfil' ? 'default' : 'outline'} onClick={() => setView('perfil')}>Perfil</Button>
          <Button variant={view==='alertas' ? 'default' : 'outline'} onClick={() => setView('alertas')}>Alertas</Button>
        </div>
      </header>
      {view === 'registro' && (
        <MedicalFormWizard onCompleted={(data: FormData) => { store.saveProfile(data); setView('perfil'); }} />
      )}
      {view === 'perfil' && <ProfileView />}
      {view === 'alertas' && <AlertsDashboard />}
    </div>
  );
}
