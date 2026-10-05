import { Card, Badge } from 'react-bootstrap'

function LibroCard({ titulo, autor, isbn, categoria, disponibles, total }) {
  const hayDisponibles = disponibles > 0

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Badge bg="secondary" className="mb-2">
          {categoria}
        </Badge>
        <Card.Title>{titulo}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{autor}</Card.Subtitle>
        <Card.Text className="small">ISBN: {isbn}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Badge bg={hayDisponibles ? 'success' : 'danger'}>
          {hayDisponibles
            ? `${disponibles} de ${total} disponibles`
            : 'No disponible'}
        </Badge>
      </Card.Footer>
    </Card>
  )
}

export default LibroCard