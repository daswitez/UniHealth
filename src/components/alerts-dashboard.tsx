import * as React from "react";
import { useAppState, store } from "../store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";

export function AlertsDashboard() {
  const { alerts } = useAppState();
  const [filter, setFilter] = React.useState<"todas" | "pendientes" | "resueltas">("pendientes");

  const filtered = alerts.filter((a) =>
    filter === "todas" ? true : filter === "pendientes" ? a.status === "pendiente" : a.status === "resuelta"
  );

  // Notify when a new pending alert arrives (useful for personal de enfermería)
  const prevCountRef = React.useRef(0);
  React.useEffect(() => {
    const pending = alerts.filter((a) => a.status === 'pendiente');
    if (pending.length > prevCountRef.current) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          const newest = pending[0];
          new Notification('Nueva Alerta Médica', { body: newest.descripcion });
        } catch {}
      }
    }
    prevCountRef.current = pending.length;
  }, [alerts]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-rose-700 flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded-full bg-rose-600" /> Centro de Alertas
        </h1>
        <div className="flex gap-2 text-sm">
          <Button variant={filter === 'pendientes' ? 'default' : 'outline'} onClick={() => setFilter('pendientes')}>Pendientes</Button>
          <Button variant={filter === 'resueltas' ? 'default' : 'outline'} onClick={() => setFilter('resueltas')}>Resueltas</Button>
          <Button variant={filter === 'todas' ? 'default' : 'outline'} onClick={() => setFilter('todas')}>Todas</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">No hay alertas para mostrar.</p>
          )}

          {filtered.map((a) => (
            <div key={a.id} className="flex items-start justify-between border rounded-lg p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                  <Badge variant={a.status === 'pendiente' ? 'destructive' : 'default'}>
                    {a.status}
                  </Badge>
                  {a.severidad && (
                    <Badge variant={a.severidad === 'critica' ? 'destructive' : a.severidad === 'alta' ? 'default' : 'secondary'}>
                      {a.severidad === 'critica' ? 'crítica' : a.severidad}
                    </Badge>
                  )}
                </div>
                <p className="text-sm"><span className="font-medium">{a.tipo || 'Incidente'}</span>: {a.descripcion}</p>
                {a.ubicacionTexto && (
                  <div className="text-xs text-gray-600">Ubicación: {a.ubicacionTexto}</div>
                )}
                {a.ubicacion && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" /> {a.ubicacion.lat.toFixed(5)}, {a.ubicacion.lng.toFixed(5)}
                  </div>
                )}
              </div>
              {a.status === 'pendiente' && (
                <Button size="sm" onClick={() => store.resolveAlert(a.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Marcar resuelta
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
