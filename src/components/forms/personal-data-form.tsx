import { useState } from 'react';
import { FormData } from '../medical-form-wizard';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronRight } from 'lucide-react';

type Props = {
  initialData: FormData;
  onNext: (data: Partial<FormData>) => void;
};

export function PersonalDataForm({ initialData, onNext }: Props) {
  const [formData, setFormData] = useState({
    nombreCompleto: initialData.nombreCompleto,
    cedula: initialData.cedula,
    fechaNacimiento: initialData.fechaNacimiento,
    edad: initialData.edad,
    sexoBiologico: initialData.sexoBiologico,
    identidadGenero: initialData.identidadGenero,
    estadoCivil: initialData.estadoCivil,
    direccion: initialData.direccion,
    telefonoEmergencia: initialData.telefonoEmergencia,
    tieneSeguro: initialData.tieneSeguro,
    nombreAseguradora: initialData.nombreAseguradora,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Auto-calculate age from birth date
    if (field === 'fechaNacimiento' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, [field]: value, edad: age.toString() }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'Campo obligatorio';
    }
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'Campo obligatorio';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Campo obligatorio';
    }
    if (!formData.edad.trim()) {
      newErrors.edad = 'Campo obligatorio';
    }
    if (!formData.sexoBiologico) {
      newErrors.sexoBiologico = 'Campo obligatorio';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Campo obligatorio';
    }
    if (!formData.telefonoEmergencia.trim()) {
      newErrors.telefonoEmergencia = 'Campo obligatorio';
    }
    if (!formData.tieneSeguro) {
      newErrors.tieneSeguro = 'Campo obligatorio';
    }
    if (formData.tieneSeguro === 'si' && !formData.nombreAseguradora.trim()) {
      newErrors.nombreAseguradora = 'Campo obligatorio';
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
        <Label htmlFor="nombreCompleto">
          Nombre completo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={(e) => handleChange('nombreCompleto', e.target.value)}
          placeholder="Ingrese su nombre completo"
          className={errors.nombreCompleto ? 'border-red-500' : ''}
        />
        {errors.nombreCompleto && (
          <p className="text-xs text-red-500 mt-1">{errors.nombreCompleto}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cedula">
          CÃ©dula / DNI <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cedula"
          value={formData.cedula}
          onChange={(e) => handleChange('cedula', e.target.value)}
          placeholder="Ej: 1234567890"
          className={errors.cedula ? 'border-red-500' : ''}
        />
        {errors.cedula && (
          <p className="text-xs text-red-500 mt-1">{errors.cedula}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fechaNacimiento">
            Fecha de nacimiento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
            className={errors.fechaNacimiento ? 'border-red-500' : ''}
          />
          {errors.fechaNacimiento && (
            <p className="text-xs text-red-500 mt-1">{errors.fechaNacimiento}</p>
          )}
        </div>

        <div>
          <Label htmlFor="edad">
            Edad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edad"
            type="number"
            value={formData.edad}
            onChange={(e) => handleChange('edad', e.target.value)}
            placeholder="AÃ±os"
            className={errors.edad ? 'border-red-500' : ''}
          />
          {errors.edad && (
            <p className="text-xs text-red-500 mt-1">{errors.edad}</p>
          )}
        </div>
      </div>

      <div>
        <Label>
          Sexo biolÃ³gico <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.sexoBiologico}
          onValueChange={(value) => handleChange('sexoBiologico', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="masculino" id="sexo-m" />
            <Label htmlFor="sexo-m" className="cursor-pointer">Masculino</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="femenino" id="sexo-f" />
            <Label htmlFor="sexo-f" className="cursor-pointer">Femenino</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intersexual" id="sexo-i" />
            <Label htmlFor="sexo-i" className="cursor-pointer">Intersexual</Label>
          </div>
        </RadioGroup>
        {errors.sexoBiologico && (
          <p className="text-xs text-red-500 mt-1">{errors.sexoBiologico}</p>
        )}
      </div>

      <div>
        <Label htmlFor="identidadGenero">Identidad de gÃ©nero (opcional)</Label>
        <Select
          value={formData.identidadGenero}
          onValueChange={(value) => handleChange('identidadGenero', value)}
        >
          <SelectTrigger id="identidadGenero">
            <SelectValue placeholder="Seleccione una opciÃ³n" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
            <SelectItem value="no-binario">No binario</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
            <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="estadoCivil">Estado civil (opcional)</Label>
        <Select
          value={formData.estadoCivil}
          onValueChange={(value) => handleChange('estadoCivil', value)}
        >
          <SelectTrigger id="estadoCivil">
            <SelectValue placeholder="Seleccione una opciÃ³n" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soltero">Soltero/a</SelectItem>
            <SelectItem value="casado">Casado/a</SelectItem>
            <SelectItem value="union-libre">UniÃ³n libre</SelectItem>
            <SelectItem value="divorciado">Divorciado/a</SelectItem>
            <SelectItem value="viudo">Viudo/a</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="direccion">
          DirecciÃ³n <span className="text-red-500">*</span>
        </Label>
        <Input
          id="direccion"
          value={formData.direccion}
          onChange={(e) => handleChange('direccion', e.target.value)}
          placeholder="Calle, ciudad, paÃ­s"
          className={errors.direccion ? 'border-red-500' : ''}
        />
        {errors.direccion && (
          <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>
        )}
      </div>

      <div>
        <Label htmlFor="telefonoEmergencia">
          TelÃ©fono / Contacto de emergencia <span className="text-red-500">*</span>
        </Label>
        <Input
          id="telefonoEmergencia"
          type="tel"
          value={formData.telefonoEmergencia}
          onChange={(e) => handleChange('telefonoEmergencia', e.target.value)}
          placeholder="+1 234 567 8900"
          className={errors.telefonoEmergencia ? 'border-red-500' : ''}
        />
        {errors.telefonoEmergencia && (
          <p className="text-xs text-red-500 mt-1">{errors.telefonoEmergencia}</p>
        )}
      </div>

      <div>
        <Label>
          Â¿Posee seguro mÃ©dico? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.tieneSeguro}
          onValueChange={(value) => handleChange('tieneSeguro', value)}
          className="flex flex-col space-y-2 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="si" id="seguro-si" />
            <Label htmlFor="seguro-si" className="cursor-pointer">SÃ­</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="seguro-no" />
            <Label htmlFor="seguro-no" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
        {errors.tieneSeguro && (
          <p className="text-xs text-red-500 mt-1">{errors.tieneSeguro}</p>
        )}
      </div>

      {formData.tieneSeguro === 'si' && (
        <div>
          <Label htmlFor="nombreAseguradora">
            Nombre de la aseguradora <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombreAseguradora"
            value={formData.nombreAseguradora}
            onChange={(e) => handleChange('nombreAseguradora', e.target.value)}
            placeholder="Ej: Seguros XYZ"
            className={errors.nombreAseguradora ? 'border-red-500' : ''}
          />
          {errors.nombreAseguradora && (
            <p className="text-xs text-red-500 mt-1">{errors.nombreAseguradora}</p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full">
        Continuar
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}

