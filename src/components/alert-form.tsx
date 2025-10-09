import * as React from "react";
import { store, type AlertSeverity } from "../store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { MapPin, BellPlus } from "lucide-react";
import { useAppState } from "../store";
import { toast } from "sonner";

function useGeolocation() {
  const [coords, setCoords] = React.useState<{ lat: number; lng: number; accuracy?: number } | undefined>();
  const [error, setError] = React.useState<string | undefined>();

  const request = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalización no disponible");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoords({ lat: latitude, lng: longitude, accuracy });
        setError(undefined);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  return { coords, error, request };
}

export function AlertForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { profile } = useAppState();
  const [tipo, setTipo] = React.useState("Desmayo");
  const [severidad, setSeveridad] = React.useState<AlertSeverity>("alta");
  const [descripcion, setDescripcion] = React.useState("");
  const [ubicacionTexto, setUbicacionTexto] = React.useState("");
  const [usarGPS, setUsarGPS] = React.useState(true);
  const [latManual, setLatManual] = React.useState("");
  const [lngManual, setLngManual] = React.useState("");
  const [telContacto, setTelContacto] = React.useState("");
  const [paciente, setPaciente] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { coords, error, request } = useGeolocation();

  React.useEffect(() => {
    request();
    setPaciente(profile?.nombreCompleto || "");
    setTelContacto(profile?.telefonoEmergencia || "");
  }, [request, profile]);

  const simulateLocation = () => {
    const baseLat = -0.1807, baseLng = -78.4678; // Quito centro aprox (ejemplo)
    const jitter = () => (Math.random() - 0.5) * 0.01;
    setLatManual(String((baseLat + jitter()).toFixed(6)));
    setLngManual(String((baseLng + jitter()).toFixed(6)));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const ubicacion = usarGPS && coords
        ? { ...coords }
        : (!usarGPS && latManual && lngManual
          ? { lat: parseFloat(latManual), lng: parseFloat(lngManual) }
          : undefined);

      const a = store.addAlert({
        descripcion: descripcion.trim() || "Alerta inmediata",
        ubicacion,
        ubicacionTexto: ubicacionTexto || undefined,
        tipo,
        severidad,
        reportadoPor: profile?.nombreCompleto || "Usuario",
        telContacto: telContacto || undefined,
        paciente: paciente || profile?.nombreCompleto || undefined,
      });
      toast.success("Alerta enviada", { description: `${a.tipo} • ${new Date(a.createdAt).toLocaleTimeString()}` });
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-rose-700">Nueva Alerta Médica</h1>
      <Card className="p-6 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Tipo de incidente</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Desmayo">Desmayo</SelectItem>
                <SelectItem value="Caída">Caída</SelectItem>
                <SelectItem value="Dolor torácico">Dolor torácico</SelectItem>
                <SelectItem value="Crisis asmática">Crisis asmática</SelectItem>
                <SelectItem value="Convulsión">Convulsión</SelectItem>
                <SelectItem value="Accidente">Accidente</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Severidad</Label>
            <RadioGroup value={severidad} onValueChange={(v)=>setSeveridad(v as AlertSeverity)} className="grid grid-cols-4 gap-2">
              {(["baja","media","alta","critica"] as const).map(s => (
                <label key={s} className="flex items-center gap-2 border rounded-md px-2 py-1 cursor-pointer">
                  <RadioGroupItem value={s} />
                  <span className="capitalize">{s === 'critica' ? 'crítica' : s}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Descripción breve</Label>
          <Textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} placeholder="Ej: Desmayo en el edificio A, 2do piso" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Ubicación textual (edificio / zona)</Label>
            <Input value={ubicacionTexto} onChange={(e)=>setUbicacionTexto(e.target.value)} placeholder="Edificio A - Laboratorio 2" />
          </div>
          <div className="space-y-1">
            <Label>Teléfono de contacto</Label>
            <Input value={telContacto} onChange={(e)=>setTelContacto(e.target.value)} placeholder="Ej: +593 999 999 999" />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Afectado</Label>
          <Input value={paciente} onChange={(e)=>setPaciente(e.target.value)} placeholder="Nombre del paciente" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch checked={usarGPS} onCheckedChange={setUsarGPS} />
            <span className="text-sm">Usar ubicación por GPS</span>
            <Button size="sm" variant="outline" onClick={request} className="ml-auto">Actualizar</Button>
            <Button size="sm" variant="outline" onClick={simulateLocation}>Simular ubicación</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />
              {usarGPS ? (
                coords ? <span>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} {coords.accuracy ? `(±${Math.round(coords.accuracy)}m)` : ''}</span> : <span>{error ? `Error: ${error}` : 'Obteniendo ubicación...'}</span>
              ) : (
                <span>Manual</span>
              )}
            </div>
            {!usarGPS && (
              <>
                <Input type="text" inputMode="decimal" placeholder="Latitud" value={latManual} onChange={(e)=>setLatManual(e.target.value)} />
                <Input type="text" inputMode="decimal" placeholder="Longitud" value={lngManual} onChange={(e)=>setLngManual(e.target.value)} />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={simulateLocation}>Simular ubicación</Button>
          <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700">
            <BellPlus className="w-4 h-4 mr-2" /> Enviar alerta
          </Button>
        </div>
        </form>
      </Card>

      <Card className="p-4 text-sm text-gray-600">
        <div className="font-medium mb-2">Plantillas rápidas</div>
        <div className="flex flex-wrap gap-2">
          {[
            {t:"Desmayo", s:"alta", d:"Desmayo en pasillo"},
            {t:"Caída", s:"media", d:"Caída en escaleras"},
            {t:"Dolor torácico", s:"critica", d:"Dolor torácico, sudoración"},
          ].map(p => (
            <button key={p.t} className="px-2 py-1 rounded border hover:bg-gray-50" onClick={()=>{ setTipo(p.t); setSeveridad(p.s as AlertSeverity); setDescripcion(p.d); }}>
              {p.t}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
