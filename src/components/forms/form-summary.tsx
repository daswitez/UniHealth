import { FormData } from '../medical-form-wizard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ChevronLeft, User, Heart, Activity, Check } from 'lucide-react';

type Props = {
  formData: FormData;
  onBack: () => void;
  onSubmit: () => void;
};

export function FormSummary({ formData, onBack, onSubmit }: Props) {
  const formatEnfermedades = () => {
    if (formData.enfermedadesCronicas.includes('ninguna')) {
      return 'Ninguna';
    }
    const enfermedades = formData.enfermedadesCronicas.map(e => {
      if (e === 'otra') return formData.otraEnfermedad;
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    return enfermedades.join(', ');
  };

  const formatFrecuenciaActividad = (freq: string) => {
    const labels: Record<string, string> = {
      '1-2-semana': '1-2 veces por semana',
      '3-4-semana': '3-4 veces por semana',
      '5-mas-semana': '5 o más veces por semana',
      'diario': 'Todos los días',
    };
    return labels[freq] || freq;
  };

  const formatAlimentacion = (alim: string) => {
    const labels: Record<string, string> = {
      'muy-saludable': 'Muy saludable',
      'saludable': 'Saludable',
      'regular': 'Regular',
      'poco-saludable': 'Poco saludable',
      'poco-balanceada': 'Poco balanceada',
    };
    return labels[alim] || alim;
  };

  const getEstresLabel = (value: string) => {
    const labels: Record<string, string> = {
      '1': 'Muy bajo (1)',
      '2': 'Bajo (2)',
      '3': 'Moderado (3)',
      '4': 'Alto (4)',
      '5': 'Muy alto (5)',
    };
    return labels[value] || 'Moderado (3)';
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Por favor revise la información antes de enviar el formulario
      </p>

      {/* Datos Personales */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-blue-600">Datos Personales</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500">Nombre completo</p>
              <p>{formData.nombreCompleto}</p>
            </div>
            <div>
              <p className="text-gray-500">Cédula/DNI</p>
              <p>{formData.cedula}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-gray-500">Edad</p>
              <p>{formData.edad} años</p>
            </div>
            <div>
              <p className="text-gray-500">Sexo biológico</p>
              <p className="capitalize">{formData.sexoBiologico}</p>
            </div>
            {formData.estadoCivil && (
              <div>
                <p className="text-gray-500">Estado civil</p>
                <p className="capitalize">{formData.estadoCivil}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-500">Dirección</p>
            <p>{formData.direccion}</p>
          </div>
          <div>
            <p className="text-gray-500">Teléfono de emergencia</p>
            <p>{formData.telefonoEmergencia}</p>
          </div>
          <div>
            <p className="text-gray-500">Seguro médico</p>
            <p>
              {formData.tieneSeguro === 'si'
                ? `Sí - ${formData.nombreAseguradora}`
                : 'No posee'}
            </p>
          </div>
        </div>
      </Card>

      {/* Antecedentes Médicos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-red-600">Antecedentes Médicos</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-gray-500">Enfermedades crónicas</p>
            <p>{formatEnfermedades()}</p>
          </div>
          <div>
            <p className="text-gray-500">Medicamentos regulares</p>
            <p className="whitespace-pre-line">{formData.medicamentosRegulares}</p>
          </div>
          <div>
            <p className="text-gray-500">Cirugías anteriores</p>
            <p className="whitespace-pre-line">{formData.cirugiasAnteriores}</p>
          </div>
          <div>
            <p className="text-gray-500">Alergias</p>
            <p className="whitespace-pre-line">{formData.alergias}</p>
          </div>
          {formData.hospitalizacionesPrevias && (
            <div>
              <p className="text-gray-500">Hospitalizaciones previas</p>
              <p className="whitespace-pre-line">{formData.hospitalizacionesPrevias}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Discapacidad</p>
            <p>
              {formData.tieneDiscapacidad === 'si'
                ? formData.descripcionDiscapacidad
                : 'Ninguna'}
            </p>
          </div>
        </div>
      </Card>

      {/* Hábitos y Estilo de Vida */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-green-600">Hábitos y Estilo de Vida</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500">Fumador</p>
              <p className="capitalize">{formData.fuma === 'no' ? 'No' : formData.fuma === 'si' ? 'Sí' : formData.fuma.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-gray-500">Consume alcohol</p>
              <p className="capitalize">{formData.consumeAlcohol}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Actividad física</p>
            <p>
              {formData.actividadFisica === 'si'
                ? `Sí - ${formatFrecuenciaActividad(formData.frecuenciaActividad)}`
                : 'No realiza'}
            </p>
          </div>
          {formData.alimentacion && (
            <div>
              <p className="text-gray-500">Alimentación</p>
              <p>{formatAlimentacion(formData.alimentacion)}</p>
            </div>
          )}
          {formData.horasSueno && (
            <div>
              <p className="text-gray-500">Horas de sueño</p>
              <p>{formData.horasSueno} horas</p>
            </div>
          )}
          {formData.nivelEstres && (
            <div>
              <p className="text-gray-500">Nivel de estrés</p>
              <p>{getEstresLabel(formData.nivelEstres)}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button type="button" onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-2" />
          Enviar Formulario
        </Button>
      </div>
    </div>
  );
}

