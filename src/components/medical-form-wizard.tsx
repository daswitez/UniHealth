import { useState } from 'react';
import { PersonalDataForm } from './forms/personal-data-form';
import { MedicalHistoryForm } from './forms/medical-history-form';
import { LifestyleHabitsForm } from './forms/lifestyle-habits-form';
import { FormSummary } from './forms/form-summary';
import { Progress } from './ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { store } from '../store';

export type FormData = {
  // Datos personales
  nombreCompleto: string;
  cedula: string;
  fechaNacimiento: string;
  edad: string;
  sexoBiologico: string;
  identidadGenero: string;
  estadoCivil: string;
  direccion: string;
  telefonoEmergencia: string;
  tieneSeguro: string;
  nombreAseguradora: string;
  
  // Antecedentes médicos
  enfermedadesCronicas: string[];
  otraEnfermedad: string;
  medicamentosRegulares: string;
  cirugiasAnteriores: string;
  alergias: string;
  hospitalizacionesPrevias: string;
  tieneDiscapacidad: string;
  descripcionDiscapacidad: string;
  
  // Hábitos y estilo de vida
  fuma: string;
  consumeAlcohol: string;
  actividadFisica: string;
  frecuenciaActividad: string;
  alimentacion: string;
  horasSueno: string;
  nivelEstres: string;
};

export function MedicalFormWizard({ onCompleted }: { onCompleted?: (data: FormData) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    cedula: '',
    fechaNacimiento: '',
    edad: '',
    sexoBiologico: '',
    identidadGenero: '',
    estadoCivil: '',
    direccion: '',
    telefonoEmergencia: '',
    tieneSeguro: '',
    nombreAseguradora: '',
    enfermedadesCronicas: [],
    otraEnfermedad: '',
    medicamentosRegulares: '',
    cirugiasAnteriores: '',
    alergias: '',
    hospitalizacionesPrevias: '',
    tieneDiscapacidad: '',
    descripcionDiscapacidad: '',
    fuma: '',
    consumeAlcohol: '',
    actividadFisica: '',
    frecuenciaActividad: '',
    alimentacion: '',
    horasSueno: '',
    nivelEstres: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    console.log('Formulario completado:', formData);
    // Siempre persistimos el perfil en el store
    try { store.saveProfile(formData); } catch {}
    if (onCompleted) {
      onCompleted(formData);
    } else {
      setIsSubmitted(true);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return '🧍‍♂️ Datos Personales';
      case 2:
        return '❤️ Antecedentes Médicos';
      case 3:
        return '🏃‍♂️ Hábitos y Estilo de Vida';
      case 4:
        return '📋 Resumen';
      default:
        return '';
    }
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-green-600 mb-2">¡Registro Completado!</h2>
          <p className="text-gray-600 mb-6">
            Su historial médico ha sido registrado exitosamente
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                nombreCompleto: '',
                cedula: '',
                fechaNacimiento: '',
                edad: '',
                sexoBiologico: '',
                identidadGenero: '',
                estadoCivil: '',
                direccion: '',
                telefonoEmergencia: '',
                tieneSeguro: '',
                nombreAseguradora: '',
                enfermedadesCronicas: [],
                otraEnfermedad: '',
                medicamentosRegulares: '',
                cirugiasAnteriores: '',
                alergias: '',
                hospitalizacionesPrevias: '',
                tieneDiscapacidad: '',
                descripcionDiscapacidad: '',
                fuma: '',
                consumeAlcohol: '',
                actividadFisica: '',
                frecuenciaActividad: '',
                alimentacion: '',
                horasSueno: '',
                nivelEstres: '',
              });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Nuevo Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h1 className="text-blue-600 mb-1">Historial Médico Digital</h1>
          <p className="text-gray-600 text-sm">{getStepTitle()}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form steps */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {currentStep === 1 && (
          <PersonalDataForm
            initialData={formData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <MedicalHistoryForm
            initialData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <LifestyleHabitsForm
            initialData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <FormSummary
            formData={formData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

