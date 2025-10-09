import { useSyncExternalStore } from "react";
import type { FormData } from "./components/medical-form-wizard";

export type AlertStatus = "pendiente" | "resuelta";
export type AlertSeverity = "baja" | "media" | "alta" | "critica";

export type MedicalAlert = {
  id: string;
  createdAt: string; // ISO
  descripcion: string;
  status: AlertStatus;
  ubicacion?: { lat: number; lng: number; accuracy?: number };
  ubicacionTexto?: string;
  tipo?: string;
  severidad?: AlertSeverity;
  reportadoPor?: string;
  telContacto?: string;
  paciente?: string;
  asignadoA?: string;
};

type State = {
  profile?: FormData;
  alerts: MedicalAlert[];
};

type Store = State & {
  saveProfile: (data: FormData) => void;
  addAlert: (input: {
    descripcion: string;
    ubicacion?: MedicalAlert["ubicacion"];
    ubicacionTexto?: string;
    tipo?: string;
    severidad?: AlertSeverity;
    reportadoPor?: string;
    telContacto?: string;
    paciente?: string;
  }) => MedicalAlert;
  resolveAlert: (id: string) => void;
  subscribe: (cb: () => void) => () => void;
  getSnapshot: () => State;
};

const KEY = "app_state_v1";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { alerts: [] };
    const parsed = JSON.parse(raw) as State;
    return { ...parsed, alerts: parsed.alerts || [] };
  } catch {
    return { alerts: [] };
  }
}

function persist(state: State) {
  localStorage.setItem(KEY, JSON.stringify(state));
  // ping other tabs to simulate a broadcast
  localStorage.setItem("__alerts_ping__", String(Date.now()));
}

let state: State = load();
const listeners = new Set<() => void>();

function emit() {
  persist(state);
  listeners.forEach((l) => l());
}

window.addEventListener("storage", (ev) => {
  if (ev.key === KEY || ev.key === "__alerts_ping__") {
    state = load();
    listeners.forEach((l) => l());
  }
});

export const store: Store = {
  getSnapshot: () => state,
  subscribe: (cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  saveProfile: (data) => {
    state = { ...state, profile: data };
    emit();
  },
  addAlert: ({ descripcion, ubicacion, ubicacionTexto, tipo, severidad, reportadoPor, telContacto, paciente }) => {
    const alert: MedicalAlert = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      descripcion,
      status: "pendiente",
      ubicacion,
      ubicacionTexto,
      tipo: tipo || "Otro",
      severidad: severidad || "media",
      reportadoPor,
      telContacto,
      paciente,
      asignadoA: (() => {
        const equipos = [
          "Enfermería - Edificio A",
          "Enfermería - Edificio B",
          "Enfermería - Edificio C",
        ];
        return equipos[Math.floor(Math.random() * equipos.length)];
      })(),
    };
    state = { ...state, alerts: [alert, ...state.alerts] };
    emit();
    // try Notification API
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        const title = "Nueva Alerta Médica";
        const body = `${new Date(alert.createdAt).toLocaleTimeString()} • ${descripcion}`;
        new Notification(title, { body });
      } catch {}
    }
    return alert;
  },
  resolveAlert: (id) => {
    state = {
      ...state,
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: "resuelta" } : a)),
    };
    emit();
  },
  alerts: [],
};

export function useAppState() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
