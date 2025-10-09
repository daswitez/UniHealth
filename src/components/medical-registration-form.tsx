import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MedicalRegistrationFormProps {
  onSubmitSuccess: () => void;
}

export function MedicalRegistrationForm({ onSubmitSuccess }: MedicalRegistrationFormProps) {
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoSangre: '',
    
    // Contacto de emergencia
    nombreEmergencia: '',
    telefonoEmergencia: '',
    relacionEmergencia: '',
    
    // Historial médico
    alergias: '',
    medicamentos: '',
    condicionesPreexistentes: [] as string[],
    cirugiasPrevias: '',
    
    // Información adicional
    notasAdicionales: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      condicionesPreexistentes: prev.condicionesPreexistentes.includes(condition)
        ? prev.condicionesPreexistentes.filter(c => c !== condition)
        : [...prev.condicionesPreexistentes, condition]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.tipoSangre) newErrors.tipoSangre = 'El tipo de sangre es obligatorio';
    if (!formData.nombreEmergencia.trim()) newErrors.nombreEmergencia = 'El contacto de emergencia es obligatorio';
    if (!formData.telefonoEmergencia.trim()) newErrors.telefonoEmergencia = 'El teléfono de emergencia es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Formulario enviado:', formData);
      onSubmitSuccess();
      
      // Resetear formulario
      setFormData({
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        tipoSangre: '',
        nombreEmergencia: '',
        telefonoEmergencia: '',
        relacionEmergencia: '',
        alergias: '',
        medicamentos: '',
        condicionesPreexistentes: [],
        cirugiasPrevias: '',
        notasAdicionales: '',
      });
    }
  };

  const condicionesMedicas = [
    'Diabetes',
    'Hipertensión',
    'Asma',
    'Enfermedad cardíaca',
    'Epilepsia',
    'Artritis',
    'Tiroides',
    'Cáncer',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ingrese su nombre"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apellidos"
              value={formData.apellidos}
              onChange={(e) => handleInputChange('apellidos', e.target.value)}
              placeholder="Ingrese sus apellidos"
              className={errors.apellidos ? 'border-red-500' : ''}
            />
            {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
              className={errors.fechaNacimiento ? 'border-red-500' : ''}
            />
            {errors.fechaNacimiento && <p className="text-red-500 text-sm">{errors.fechaNacimiento}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="+34 600 000 000"
              className={errors.telefono ? 'border-red-500' : ''}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Calle, número, ciudad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoSangre">
              Tipo de Sangre <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.tipoSangre} onValueChange={(value) => handleInputChange('tipoSangre', value)}>
              <SelectTrigger className={errors.tipoSangre ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione tipo de sangre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipoSangre && <p className="text-red-500 text-sm">{errors.tipoSangre}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Contacto de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle>Contacto de Emergencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreEmergencia">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombreEmergencia"
              value={formData.nombreEmergencia}
              onChange={(e) => handleInputChange('nombreEmergencia', e.target.value)}
              placeholder="Nombre del contacto de emergencia"
              className={errors.nombreEmergencia ? 'border-red-500' : ''}
            />
            {errors.nombreEmergencia && <p className="text-red-500 text-sm">{errors.nombreEmergencia}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefonoEmergencia">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefonoEmergencia"
              type="tel"
              value={formData.telefonoEmergencia}
              onChange={(e) => handleInputChange('telefonoEmergencia', e.target.value)}
              placeholder="+34 600 000 000"
              className={errors.telefonoEmergencia ? 'border-red-500' : ''}
            />
            {errors.telefonoEmergencia && <p className="text-red-500 text-sm">{errors.telefonoEmergencia}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relacionEmergencia">Relación</Label>
            <Select value={formData.relacionEmergencia} onValueChange={(value) => handleInputChange('relacionEmergencia', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la relación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padre">Padre/Madre</SelectItem>
                <SelectItem value="hijo">Hijo/Hija</SelectItem>
                <SelectItem value="hermano">Hermano/Hermana</SelectItem>
                <SelectItem value="conyuge">Cónyuge</SelectItem>
                <SelectItem value="pareja">Pareja</SelectItem>
                <SelectItem value="amigo">Amigo/Amiga</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Historial Médico */}
      <Card>
        <CardHeader>
          <CardTitle>Historial Médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alergias">Alergias</Label>
            <Textarea
              id="alergias"
              value={formData.alergias}
              onChange={(e) => handleInputChange('alergias', e.target.value)}
              placeholder="Medicamentos, alimentos, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicamentos">Medicamentos Actuales</Label>
            <Textarea
              id="medicamentos"
              value={formData.medicamentos}
              onChange={(e) => handleInputChange('medicamentos', e.target.value)}
              placeholder="Lista de medicamentos que toma actualmente"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Condiciones Médicas Preexistentes</Label>
            <div className="space-y-2">
              {condicionesMedicas.map((condicion) => (
                <div key={condicion} className="flex items-center space-x-2">
                  <Checkbox
                    id={condicion}
                    checked={formData.condicionesPreexistentes.includes(condicion)}
                    onCheckedChange={() => handleConditionToggle(condicion)}
                  />
                  <Label htmlFor={condicion} className="cursor-pointer">
                    {condicion}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cirugiasPrevias">Cirugías Previas</Label>
            <Textarea
              id="cirugiasPrevias"
              value={formData.cirugiasPrevias}
              onChange={(e) => handleInputChange('cirugiasPrevias', e.target.value)}
              placeholder="Describa cirugías previas y fechas aproximadas"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notasAdicionales">Notas Adicionales</Label>
            <Textarea
              id="notasAdicionales"
              value={formData.notasAdicionales}
              onChange={(e) => handleInputChange('notasAdicionales', e.target.value)}
              placeholder="Cualquier información adicional relevante"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Enviar Registro
      </Button>
    </form>
  );
}

