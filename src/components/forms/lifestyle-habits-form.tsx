import { useState } from 'react';
import { FormData } from '../medical-form-wizard';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  initialData: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
};

export function LifestyleHabitsForm({ initialData, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    fuma: initialData.fuma,
    consumeAlcohol: initialData.consumeAlcohol,
    actividadFisica: initialData.actividadFisica,
    frecuenciaActividad: initialData.frecuenciaActividad,
    alimentacion: initialData.alimentacion,
    horasSueno: initialData.horasSueno,
    nivelEstres: initialData.nivelEstres || '3',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fuma) {
      newErrors.fuma = 'Campo obligatorio';
    }
    if (!formData.consumeAlcohol) {
      newErrors.consumeAlcohol = 'Campo obligatorio';
    }
    if (!formData.actividadFisica) {
      newErrors.actividadFisica = 'Campo obligatorio';
    }
    if (formData.actividadFisica === 'si' && !formData.frecuenciaActividad) {
      newErrors.frecuenciaActividad = 'Por favor indique la frecuencia';
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

  const getEstresLabel = (value: string) => {
    const labels: Record<string, string> = {
      '1': 'Muy bajo',
      '2': 'Bajo',
      '3': 'Moderado',
      '4': 'Alto',
      '5': 'Muy alto',
    };
    return labels[value] || 'Moderado';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>
          Â¿Fuma o ha fumado alguna vez? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.fuma}
          onValueChange={(value) => handleChange('fuma', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="fuma-no" />
            <Label htmlFor="fuma-no" className="cursor-pointer">No, nunca</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ocasional" id="fuma-ocasional" />
            <Label htmlFor="fuma-ocasional" className="cursor-pointer">Ocasionalmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="fuma-si" />
            <Label htmlFor="fuma-si" className="cursor-pointer">SÃ­, regularmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ex-fumador" id="fuma-ex" />
            <Label htmlFor="fuma-ex" className="cursor-pointer">Ex fumador</Label>
          </div>
        </RadioGroup>
        {errors.fuma && (
          <p className="text-xs text-red-500 mt-1">{errors.fuma}</p>
        )}
      </div>

      <div>
        <Label>
          Â¿Consume alcohol? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.consumeAlcohol}
          onValueChange={(value) => handleChange('consumeAlcohol', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nunca" id="alcohol-nunca" />
            <Label htmlFor="alcohol-nunca" className="cursor-pointer">Nunca</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ocasional" id="alcohol-ocasional" />
            <Label htmlFor="alcohol-ocasional" className="cursor-pointer">Ocasionalmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="frecuente" id="alcohol-frecuente" />
            <Label htmlFor="alcohol-frecuente" className="cursor-pointer">Frecuentemente</Label>
          </div>
        </RadioGroup>
        {errors.consumeAlcohol && (
          <p className="text-xs text-red-500 mt-1">{errors.consumeAlcohol}</p>
        )}
      </div>

      <div>
        <Label>
          Â¿Realiza actividad fÃ­sica regularmente? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.actividadFisica}
          onValueChange={(value) => handleChange('actividadFisica', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="actividad-si" />
            <Label htmlFor="actividad-si" className="cursor-pointer">SÃ­</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="actividad-no" />
            <Label htmlFor="actividad-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
        {errors.actividadFisica && (
          <p className="text-xs text-red-500 mt-1">{errors.actividadFisica}</p>
        )}
      </div>

      {formData.actividadFisica === 'si' && (
        <div>
          <Label htmlFor="frecuenciaActividad">
            Frecuencia de actividad fÃ­sica <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.frecuenciaActividad}
            onValueChange={(value) => handleChange('frecuenciaActividad', value)}
          >
            <SelectTrigger id="frecuenciaActividad" className={errors.frecuenciaActividad ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione la frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2-semana">1-2 veces por semana</SelectItem>
              <SelectItem value="3-4-semana">3-4 veces por semana</SelectItem>
              <SelectItem value="5-mas-semana">5 o mÃ¡s veces por semana</SelectItem>
              <SelectItem value="diario">Todos los dÃ­as</SelectItem>
            </SelectContent>
          </Select>
          {errors.frecuenciaActividad && (
            <p className="text-xs text-red-500 mt-1">{errors.frecuenciaActividad}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="alimentacion">
          Â¿CÃ³mo describirÃ­a su alimentaciÃ³n diaria? (opcional)
        </Label>
        <Select
          value={formData.alimentacion}
          onValueChange={(value) => handleChange('alimentacion', value)}
        >
          <SelectTrigger id="alimentacion">
            <SelectValue placeholder="Seleccione una opciÃ³n" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="muy-saludable">Muy saludable</SelectItem>
            <SelectItem value="saludable">Saludable</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="poco-saludable">Poco saludable</SelectItem>
            <SelectItem value="poco-balanceada">Poco balanceada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="horasSueno">
          Horas de sueÃ±o promedio (opcional)
        </Label>
        <Input
          id="horasSueno"
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={formData.horasSueno}
          onChange={(e) => handleChange('horasSueno', e.target.value)}
          placeholder="Ej: 7"
        />
      </div>

      <div>
        <Label htmlFor="nivelEstres">
          Nivel de estrÃ©s (opcional)
        </Label>
        <div className="space-y-3 mt-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>1 (Muy bajo)</span>
            <span className="font-medium text-blue-600">{getEstresLabel(formData.nivelEstres)}</span>
            <span>5 (Muy alto)</span>
          </div>
          <Slider
            id="nivelEstres"
            min={1}
            max={5}
            step={1}
            value={[parseInt(formData.nivelEstres)]}
            onValueChange={(value) => handleChange('nivelEstres', value[0].toString())}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

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

