import { Card, Badge } from 'react-bootstrap';

function AlumnosCard({ nombre, apellido, legajo, carrera, prestamosActivos }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{nombre} {apellido}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Carrera: {carrera}</Card.Subtitle>
        <Card.Text className="small">Legajo: {legajo}</Card.Text>
      </Card.Body>

      <Card.Footer>
        <Badge bg={prestamosActivos > 0 ? 'primary' : 'secondary'}>
          {prestamosActivos} Préstamo(s) activo(s)
        </Badge>
      </Card.Footer>
    </Card>
  );
}

export default AlumnosCard;