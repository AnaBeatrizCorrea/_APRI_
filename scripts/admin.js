// ── Tab switching ──────────────────────────────────────────
function switchTab(tabId, btn) {
    // Desativa todos os painéis
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    // Desativa todos os botões
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // Ativa o painel e botão corretos
    document.getElementById('tab-' + tabId).classList.add('active');
    btn.classList.add('active');
}


// ── Expandir / recolher detalhes do associado ──────────────
function toggleAssociado(btn) {
    const card = btn.closest('.associado-card');
    const detalhes = card.nextElementSibling;
    const icon = btn.querySelector('i');

    const aberto = detalhes.style.display === 'block';
    detalhes.style.display = aberto ? 'none' : 'block';
    icon.className = aberto ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
}


// ── Filtrar / ordenar associados ───────────────────────────
function filtrarAssociados() {
    const busca  = document.getElementById('busca-associado').value.toLowerCase();
    const status = document.getElementById('filtro-status').value;
    const ordem  = document.getElementById('ordenar').value;

    const lista = document.getElementById('lista-associados');

    // Pega pares [card, detalhes]
    const pares = [];
    const filhos = Array.from(lista.children);
    for (let i = 0; i < filhos.length; i += 2) {
        pares.push({ card: filhos[i], detalhe: filhos[i + 1] });
    }

    // Filtra
    const visiveis = pares.filter(({ card }) => {
        const nome   = card.dataset.nome.toLowerCase();
        const st     = card.dataset.status;
        const nomeOk = nome.includes(busca);
        const stOk   = status === '' || st === status;
        return nomeOk && stOk;
    });

    // Ordena
    visiveis.sort((a, b) => {
        const na = a.card.dataset.nome;
        const nb = b.card.dataset.nome;
        return ordem === 'az' ? na.localeCompare(nb) : nb.localeCompare(na);
    });

    // Re-insere na ordem correta
    lista.innerHTML = '';
    visiveis.forEach(({ card, detalhe }) => {
        lista.appendChild(card);
        lista.appendChild(detalhe);
    });

    // Esconde os que não passaram no filtro (já não estão no DOM)
    // — nada a fazer, innerHTML limpo e re-populado apenas com visiveis
}