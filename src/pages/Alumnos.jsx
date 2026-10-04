import{Container, Row, Col} from 'react-bootstrap'; 
import AlumnosCard from '../components/alumnosCard';
import{ alumnos } from '../data/alumnos';
import useSEO from '../hooks/useSEO';

function Alumnos() {
  useSEO('Alumnos','Listado de alumnos registrados en la biblioteca de la UTN y sus préstamos activos.');

  return (
    <Container className='my-5'>
      <h1 className='mb-4'>Alumnos</h1>
      <section>
        <Row>
          {alumnos.map((alumno) => (
            <Col key={alumno.id} xs={12} md={6} lg={4} className='mb-4'>
              <AlumnosCard 
                nombre={alumno.nombre}
                apellido={alumno.apellido}
                legajo={alumno.legajo}
                carrera={alumno.carrera}
                prestamosActivos={alumno.prestamosActivos}
              />
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
}
export default Alumnos;