import { useState } from 'react';
import { FormData } from '../medical-form-wizard';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  initialData: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
};

const enfermedadesComunues = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hipertension', label: 'HipertensiÃ³n' },
  { id: 'asma', label: 'Asma' },
  { id: 'cardiopatia', label: 'CardiopatÃ­a' },
  { id: 'tiroides', label: 'Problemas de tiroides' },
  { id: 'artritis', label: 'Artritis' },
  { id: 'ninguna', label: 'Ninguna' },
  { id: 'otra', label: 'Otra' },
];

export function MedicalHistoryForm({ initialData, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    enfermedadesCronicas: initialData.enfermedadesCronicas,
    otraEnfermedad: initialData.otraEnfermedad,
    medicamentosRegulares: initialData.medicamentosRegulares,
    cirugiasAnteriores: initialData.cirugiasAnteriores,
    alergias: initialData.alergias,
    hospitalizacionesPrevias: initialData.hospitalizacionesPrevias,
    tieneDiscapacidad: initialData.tieneDiscapacidad,
    descripcionDiscapacidad: initialData.descripcionDiscapacidad,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleEnfermedadToggle = (enfermedadId: string) => {
    let newEnfermedades = [...formData.enfermedadesCronicas];
    
    if (enfermedadId === 'ninguna') {
      if (newEnfermedades.includes('ninguna')) {
        newEnfermedades = [];
      } else {
        newEnfermedades = ['ninguna'];
      }
    } else {
      if (newEnfermedades.includes(enfermedadId)) {
        newEnfermedades = newEnfermedades.filter(id => id !== enfermedadId);
      } else {
        newEnfermedades = newEnfermedades.filter(id => id !== 'ninguna');
        newEnfermedades.push(enfermedadId);
      }
    }
    
    handleChange('enfermedadesCronicas', newEnfermedades);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.enfermedadesCronicas.length === 0) {
      newErrors.enfermedadesCronicas = 'Debe seleccionar al menos una opciÃ³n';
    }
    if (formData.enfermedadesCronicas.includes('otra') && !formData.otraEnfermedad.trim()) {
      newErrors.otraEnfermedad = 'Por favor especifique la enfermedad';
    }
    if (!formData.medicamentosRegulares.trim()) {
      newErrors.medicamentosRegulares = 'Campo obligatorio. Si no toma medicamentos, escriba "Ninguno"';
    }
    if (!formData.cirugiasAnteriores.trim()) {
      newErrors.cirugiasAnteriores = 'Campo obligatorio. Si no ha tenido cirugÃ­as, escriba "Ninguna"';
    }
    if (!formData.alergias.trim()) {
      newErrors.alergias = 'Campo obligatorio. Si no tiene alergias, escriba "Ninguna"';
    }
    if (!formData.tieneDiscapacidad) {
      newErrors.tieneDiscapacidad = 'Campo obligatorio';
    }
    if (formData.tieneDiscapacidad === 'si' && !formData.descripcionDiscapacidad.trim()) {
      newErrors.descripcionDiscapacidad = 'Por favor describa la discapacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>
          Â¿Padece actualmente alguna enfermedad crÃ³nica? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-3">Seleccione todas las que apliquen</p>
        <div className="space-y-3">
          {enfermedadesComunues.map((enfermedad) => (
            <div key={enfermedad.id} className="flex items-center space-x-2">
              <Checkbox
                id={enfermedad.id}
                checked={formData.enfermedadesCronicas.includes(enfermedad.id)}
                onCheckedChange={() => handleEnfermedadToggle(enfermedad.id)}
              />
              <Label htmlFor={enfermedad.id} className="cursor-pointer">
                {enfermedad.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.enfermedadesCronicas && (
          <p className="text-xs text-red-500 mt-1">{errors.enfermedadesCronicas}</p>
        )}
      </div>

      {formData.enfermedadesCronicas.includes('otra') && (
        <div>
          <Label htmlFor="otraEnfermedad">
            Especifique otra enfermedad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="otraEnfermedad"
            value={formData.otraEnfermedad}
            onChange={(e) => handleChange('otraEnfermedad', e.target.value)}
            placeholder="Nombre de la enfermedad"
            className={errors.otraEnfermedad ? 'border-red-500' : ''}
          />
          {errors.otraEnfermedad && (
            <p className="text-xs text-red-500 mt-1">{errors.otraEnfermedad}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="medicamentosRegulares">
          Â¿Toma algÃºn medicamento de forma regular? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">Incluya nombre y dosis. Si no toma, escriba "Ninguno"</p>
        <Textarea
          id="medicamentosRegulares"
          value={formData.medicamentosRegulares}
          onChange={(e) => handleChange('medicamentosRegulares', e.target.value)}
          placeholder="Ej: LosartÃ¡n 50mg cada 12 horas&#10;Metformina 850mg con las comidas"
          rows={3}
          className={errors.medicamentosRegulares ? 'border-red-500' : ''}
        />
        {errors.medicamentosRegulares && (
          <p className="text-xs text-red-500 mt-1">{errors.medicamentosRegulares}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cirugiasAnteriores">
          Â¿Ha tenido alguna cirugÃ­a o procedimiento importante? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">Incluya el tipo de cirugÃ­a y aÃ±o. Si no ha tenido, escriba "Ninguna"</p>
        <Textarea
          id="cirugiasAnteriores"
          value={formData.cirugiasAnteriores}
          onChange={(e) => handleChange('cirugiasAnteriores', e.target.value)}
          placeholder="Ej: ApendicectomÃ­a - 2018&#10;CesÃ¡rea - 2020"
          rows={3}
          className={errors.cirugiasAnteriores ? 'border-red-500' : ''}
        />
        {errors.cirugiasAnteriores && (
          <p className="text-xs text-red-500 mt-1">{errors.cirugiasAnteriores}</p>
        )}
      </div>

      <div>
        <Label htmlFor="alergias">
          Â¿Es alÃ©rgico a algÃºn medicamento, alimento o sustancia? <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500 mb-2">Si no tiene alergias, escriba "Ninguna"</p>
        <Textarea
          id="alergias"
          value={formData.alergias}
          onChange={(e) => handleChange('alergias', e.target.value)}
          placeholder="Ej: Penicilina, mariscos, lÃ¡tex"
          rows={2}
          className={errors.alergias ? 'border-red-500' : ''}
        />
        {errors.alergias && (
          <p className="text-xs text-red-500 mt-1">{errors.alergias}</p>
        )}
      </div>

      <div>
        <Label htmlFor="hospitalizacionesPrevias">
          Â¿Ha sido hospitalizado anteriormente? (opcional)
        </Label>
        <p className="text-xs text-gray-500 mb-2">Incluya el motivo y aÃ±o</p>
        <Textarea
          id="hospitalizacionesPrevias"
          value={formData.hospitalizacionesPrevias}
          onChange={(e) => handleChange('hospitalizacionesPrevias', e.target.value)}
          placeholder="Ej: NeumonÃ­a - 2019"
          rows={2}
        />
      </div>

      <div>
        <Label>
          Â¿Padece alguna discapacidad fÃ­sica o mental? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.tieneDiscapacidad}
          onValueChange={(value) => handleChange('tieneDiscapacidad', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="discapacidad-si" />
            <Label htmlFor="discapacidad-si" className="cursor-pointer">SÃ­</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="discapacidad-no" />
            <Label htmlFor="discapacidad-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
        {errors.tieneDiscapacidad && (
          <p className="text-xs text-red-500 mt-1">{errors.tieneDiscapacidad}</p>
        )}
      </div>

      {formData.tieneDiscapacidad === 'si' && (
        <div>
          <Label htmlFor="descripcionDiscapacidad">
            DescripciÃ³n de la discapacidad <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="descripcionDiscapacidad"
            value={formData.descripcionDiscapacidad}
            onChange={(e) => handleChange('descripcionDiscapacidad', e.target.value)}
            placeholder="Describa brevemente"
            rows={2}
            className={errors.descripcionDiscapacidad ? 'border-red-500' : ''}
          />
          {errors.descripcionDiscapacidad && (
            <p className="text-xs text-red-500 mt-1">{errors.descripcionDiscapacidad}</p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          AtrÃ¡s
        </Button>
        <Button type="submit" className="flex-1">
          Continuar
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
