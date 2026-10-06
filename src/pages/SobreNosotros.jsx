function SobreNosotros() {
  const integrantes = [
    { nombre: "Esteban Nájera", foto: "/img/esteban.jpeg" },
    { nombre: "Magali Guerrero", foto: "/img/maga.jpeg" },
    { nombre: "Claudia Lopez", foto: "/img/clau.jpeg" },
  ];

  return (
    <div className="container py-5">
      <h1 className="mb-4">Sobre Nosotros</h1>

      <p className="lead">
        Biblioteca UTN nace como Trabajo Final Integrador de la carrera de
        Programación en la Universidad Tecnológica Nacional — Facultad Regional
        Tucumán, desarrollado por un equipo de tres estudiantes con el objetivo
        de aplicar de forma integral los conocimientos adquiridos a lo largo de
        la carrera: desarrollo frontend, diseño de bases de datos relacionales y
        trabajo colaborativo mediante control de versiones.
      </p>

      <p className="lead">
        El proyecto surge de una problemática habitual en las bibliotecas
        académicas: la gestión de libros, socios y préstamos suele depender de
        planillas dispersas y registros manuales, lo que genera errores, pérdida
        de información y dificultad para hacer seguimiento de devoluciones y
        vencimientos. Biblioteca UTN propone centralizar toda esa gestión en un
        sistema único, pensado para facilitar el trabajo del personal de la
        biblioteca y la consulta del catálogo por parte de estudiantes y
        docentes.
      </p>

      <p className="lead">
        Más allá de su valor académico, el equipo encaró Biblioteca UTN con una
        perspectiva de proyecto real: no como un ejercicio aislado, sino como
        una base funcional con potencial de evolucionar hacia una herramienta
        utilizable dentro de la propia universidad.
      </p>

      <div className="row row-cols-3 g-3 my-4">
        {integrantes.map((persona) => (
          <div className="col" key={persona.nombre}>
            <article className="card persona-card h-100 shadow-sm text-center">
              <div className="card-body">
                <img
                  src={persona.foto}
                  loading="lazy"
                  alt={persona.nombre}
                  className="rounded-circle mb-2 img-fluid"
                  style={{
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    maxWidth: "150px",
                    width: "100%",
                  }}
                />
                <h3 className="h6 card-title mb-0">{persona.nombre}</h3>
              </div>
            </article>
          </div>
        ))}
      </div>
      <p className="mb-0 mt-4">
        <em>
          Agradecemos a la profesora Georgina Costilla, docente de Programación
          IV, por su acompañamiento y guía a lo largo del desarrollo de este
          proyecto.
        </em>
      </p>
    </div>
  );
}

export default SobreNosotros;
