import { Container, Table, Badge } from 'react-bootstrap'
import { prestamos } from '../data/prestamos'
import useSEO from '../hooks/useSEO'

const colorEstado = {
  Activo: 'primary',
  Vencido: 'danger',
  Devuelto: 'success',
}

function Prestamos() {
  useSEO('Préstamos', 'Seguimiento de préstamos activos, vencidos y devoluciones de la biblioteca de la UTN.')

  return (
    <Container className="my-5">
      <h1 className="mb-4">Préstamos</h1>
      <section>
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Libro</th>
                <th>Préstamo</th>
                <th>Devolución prevista</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id}>
                  <td>{p.alumno}</td>
                  <td>{p.libro}</td>
                  <td>{p.fechaPrestamo}</td>
                  <td>{p.fechaDevolucion}</td>
                  <td>
                    <Badge bg={colorEstado[p.estado]}>{p.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </Container>
  )
}

export default Prestamos