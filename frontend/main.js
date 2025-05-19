fetch('/api/iniciativas')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('lista-iniciativas');
    data.forEach(ini => {
      container.innerHTML += `
        <div class="col-md-6 mb-3">
          <div class="card">
            <div class="card-body">
              <h5>${ini.titulo}</h5>
              <p><strong>Tipo:</strong> ${ini.tipo}</p>
              <p><strong>Categoria:</strong> ${ini.categoria}</p>
              <p><strong>Status:</strong> ${ini.status}</p>
              <p><strong>Valor:</strong> R$ ${ini.valor}</p>
              <a href="https://wa.me/5511999999999?text=Olá%20Ana,%20sobre%20${ini.titulo}" class="btn btn-success">WhatsApp</a>
              <a href="https://calendar.google.com/calendar/u/0/r/eventedit" class="btn btn-primary">Agendar</a>
            </div>
          </div>
        </div>
      `;
    });
  });
