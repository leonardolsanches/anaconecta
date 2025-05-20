fetch('/api/iniciativas')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('lista-iniciativas');
    if (!container) return;
    data.forEach(ini => {
      container.innerHTML += `<p><strong>${ini.titulo}</strong> - R$ ${ini.valor} (${ini.status})</p>`;
    });
  });
