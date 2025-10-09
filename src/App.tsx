import { useState, useEffect } from 'react';
import { MedicalFormWizard } from './components/medical-form-wizard';
import type { FormData } from './components/medical-form-wizard';
import { ProfileView } from './components/profile-view';
import { AlertsDashboard } from './components/alerts-dashboard';
import { AlertForm } from './components/alert-form';
import { store } from './store';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [view, setView] = useState<'registro' | 'perfil' | 'alertas' | 'nueva-alerta'>('registro');

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
      <Toaster position="top-right" />
      {view === 'registro' && (
        <MedicalFormWizard onCompleted={(data: FormData) => { store.saveProfile(data); setView('perfil'); }} />
      )}
      {view === 'perfil' && <ProfileView />}
      {view === 'alertas' && <AlertsDashboard onCreateNew={() => setView('nueva-alerta')} />}
      {view === 'nueva-alerta' && <AlertForm onSubmitted={() => setView('alertas')} />}

      {view !== 'nueva-alerta' && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button className="bg-red-600 hover:bg-red-700 shadow-lg" onClick={() => setView('nueva-alerta')}>
            Nueva Alerta
          </Button>
        </div>
      )}
    </div>
  );
}
