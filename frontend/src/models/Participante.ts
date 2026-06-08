
export class Participante {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean;

  constructor(nombre: string, email: string, edad: number, pais: string, modalidad: string, tecnologias: string[], nivel: string, aceptaTerminos: boolean) {
    this.id = Date.now();
    this.nombre = nombre;
    this.email = email;
    this.edad = edad;
    this.pais = pais;
    this.modalidad = modalidad;
    this.tecnologias = tecnologias;
    this.nivel = nivel;
    this.aceptaTerminos = aceptaTerminos;
  }
}