import * as React from "react";
import { useAppState, store } from "../store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
// Dialog eliminado para evitar bloqueos; se usa formulario inline
import { MapPin, Clock, AlertCircle, CheckCircle2, User, Heart, Activity, BellPlus, BellRing } from "lucide-react";
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

export function ProfileView() {
  const { profile, alerts } = useAppState();
  const [descripcion, setDescripcion] = React.useState("");
  const [showDetailed, setShowDetailed] = React.useState(false);
  const [tipo, setTipo] = React.useState("Desmayo");
  const [severidad, setSeveridad] = React.useState<"baja"|"media"|"alta"|"critica">("alta");
  const [ubicacionTexto, setUbicacionTexto] = React.useState("");
  const [usarGPS, setUsarGPS] = React.useState(true);
  const [latManual, setLatManual] = React.useState<string>("");
  const [lngManual, setLngManual] = React.useState<string>("");
  const [telContacto, setTelContacto] = React.useState<string>("");
  const [paciente, setPaciente] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const { coords, error, request } = useGeolocation();

  React.useEffect(() => {
    request();
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, [request]);

  React.useEffect(() => {
    setPaciente(profile?.nombreCompleto || "");
  }, [profile]);

  if (!profile) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-gray-600">No hay datos de perfil aún. Complete el registro.</p>
        </Card>
      </div>
    );
  }

  const submitAlert = async () => {
    setSubmitting(true);
    try {
      const ubicacion = usarGPS && coords ? { ...coords } :
        (!usarGPS && latManual && lngManual ? { lat: parseFloat(latManual), lng: parseFloat(lngManual) } : undefined);
      store.addAlert({
        descripcion: descripcion.trim() || "Alerta inmediata",
        ubicacion,
        ubicacionTexto: ubicacionTexto || undefined,
        tipo,
        severidad,
        reportadoPor: profile?.nombreCompleto || "Usuario",
        telContacto: telContacto || profile?.telefonoEmergencia || undefined,
        paciente: paciente || profile?.nombreCompleto || undefined,
      });
      setDescripcion("");
      setShowDetailed(false);
      toast.success("Alerta enviada", { description: `${tipo} • ${new Date().toLocaleTimeString()}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-blue-700">Perfil del Paciente</h1>
        <p className="text-sm text-gray-600">Simulación: genera alertas reales de prueba con un clic o usa el formulario detallado.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-blue-700">Datos Personales</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <Label>Nombre completo</Label>
              <p>{profile.nombreCompleto}</p>
            </div>
            <div>
              <Label>Cédula/DNI</Label>
              <p>{profile.cedula}</p>
            </div>
            <div>
              <Label>Edad</Label>
              <p>{profile.edad} años</p>
            </div>
            <div>
              <Label>Sexo biológico</Label>
              <p className="capitalize">{profile.sexoBiologico}</p>
            </div>
            {profile.estadoCivil && (
              <div>
                <Label>Estado civil</Label>
                <p className="capitalize">{profile.estadoCivil}</p>
              </div>
            )}
            <div className="col-span-2">
              <Label>Dirección</Label>
              <p>{profile.direccion}</p>
            </div>
            <div className="col-span-2">
              <Label>Teléfono de emergencia</Label>
              <p>{profile.telefonoEmergencia}</p>
            </div>
            <div className="col-span-2">
              <Label>Seguro médico</Label>
              <p>{profile.tieneSeguro === 'si' ? `Sí - ${profile.nombreAseguradora}` : 'No posee'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-red-700">Antecedentes Médicos</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <Label>Enfermedades crónicas</Label>
              <p>{profile.enfermedadesCronicas?.length ? profile.enfermedadesCronicas.join(', ') : 'Ninguna'}</p>
            </div>
            <div>
              <Label>Medicamentos regulares</Label>
              <p className="whitespace-pre-line">{profile.medicamentosRegulares || 'N/A'}</p>
            </div>
            <div>
              <Label>Cirugías anteriores</Label>
              <p className="whitespace-pre-line">{profile.cirugiasAnteriores || 'N/A'}</p>
            </div>
            <div>
              <Label>Alergias</Label>
              <p className="whitespace-pre-line">{profile.alergias || 'N/A'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-3">
        <h3 className="text-green-700 flex items-center gap-2"><Activity className="w-4 h-4" /> Hábitos y Estilo de Vida</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div>
            <Label>Fumador</Label>
            <p className="capitalize">{profile.fuma === 'no' ? 'No' : profile.fuma === 'si' ? 'Sí' : profile.fuma.replace('-', ' ')}</p>
          </div>
          <div>
            <Label>Consume alcohol</Label>
            <p className="capitalize">{profile.consumeAlcohol || 'N/A'}</p>
          </div>
          <div>
            <Label>Actividad física</Label>
            <p className="capitalize">{profile.actividadFisica === 'si' ? 'Sí' : (profile.actividadFisica || 'No')}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" /> Envío Rápido de Alerta
        </h3>
        <p className="text-sm text-gray-600">Un clic para generar una alerta inmediata con tu ubicación y hora actual.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={submitAlert} disabled={submitting} className="bg-red-600 hover:bg-red-700 flex-1 py-6 text-base">
            {submitting ? <BellRing className="w-5 h-5 mr-2" /> : <BellPlus className="w-5 h-5 mr-2" />}
            Enviar alerta inmediata
          </Button>
          <Button variant="outline" className="flex-1 py-6 text-base" onClick={() => setShowDetailed((s)=>!s)}>Formulario detallado…</Button>
        </div>
        {showDetailed && (
          <form className="mt-4 border rounded-lg p-4 space-y-4" onSubmit={(e) => { e.preventDefault(); submitAlert(); }}>
              <h3 className="text-lg font-medium">Nueva Alerta Médica</h3>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-3">
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
                    <RadioGroup value={severidad} onValueChange={(v) => setSeveridad(v as any)} className="grid grid-cols-4 gap-2">
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
                  <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Desmayo en el edificio A, 2do piso" />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
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
                    <Button size="sm" variant="outline" onClick={()=>{ const baseLat = -0.1807, baseLng = -78.4678; const jitter=()=> (Math.random()-0.5)*0.005; setLatManual(String((baseLat+jitter()).toFixed(6))); setLngManual(String((baseLng+jitter()).toFixed(6))); }}>Simular ubicación</Button>
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
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={()=>setShowDetailed(false)}>Cancelar</Button>
                  <Button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700">
                    {submitting ? <BellRing className="w-4 h-4 mr-2" /> : <BellPlus className="w-4 h-4 mr-2" />}
                    Enviar alerta
                  </Button>
                </div>
            </div>
          </form>
        )}
        <div className="flex gap-2 text-xs text-gray-600">
          <span className="px-2 py-1 rounded bg-gray-100">Plantillas:</span>
          {[
            {t:"Desmayo", s:"alta", d:"Desmayo en pasillo"},
            {t:"Caída", s:"media", d:"Caída en escaleras"},
            {t:"Dolor torácico", s:"critica", d:"Dolor torácico, sudoración"},
          ].map(p => (
            <button key={p.t} className="px-2 py-1 rounded border hover:bg-gray-50" onClick={()=>{ setTipo(p.t); setSeveridad(p.s as any); setDescripcion(p.d); setShowDetailed(true); }}>
              {p.t}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <h3 className="text-lg font-medium">Alertas Enviadas</h3>
        <div className="space-y-3">
          {alerts.length === 0 && (
            <p className="text-gray-500 text-sm">No hay alertas registradas.</p>
          )}
          {alerts.map((a) => (
            <div key={a.id} className="flex items-start justify-between border rounded-lg p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                  <Badge variant={a.status === 'pendiente' ? 'destructive' : 'default'}>
                    {a.status === 'pendiente' ? 'pendiente' : 'resuelta'}
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
                <Button size="sm" variant="outline" onClick={() => store.resolveAlert(a.id)}>
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
